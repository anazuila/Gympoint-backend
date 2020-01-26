import * as Yup from 'yup';
import { startOfDay, isBefore, addMonths, parseISO } from 'date-fns';
import Management from '../models/Management';

import Plans from '../models/Plans';
import Students from '../models/Students';

import ManagementMail from '../jobs/ManagementMail';
import Queue from '../../lib/Queue';

class ManagementController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const dayStart = startOfDay(parseISO(start_date));

    if (isBefore(dayStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited.' });
    }

    const plans = await Plans.findOne({
      where: { id: plan_id },
    });

    const student = await Students.findOne({
      where: { id: student_id },
    });

    const endDate = addMonths(dayStart, plans.duration);

    const totalPrice = plans.price * plans.duration;

    const finalPrice = totalPrice.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });

    const management = await Management.create({
      student_id,
      plan_id,
      start_date: dayStart,
      end_date: endDate,
    });

    await management.save();

    await Queue.add(ManagementMail.key, {
      student,
      plans,
      endDate,
      finalPrice,
    });

    return res.json({
      student_id,
      plan_id,
      start_date,
      endDate,
      finalPrice,
    });
  }
}

export default new ManagementController();
