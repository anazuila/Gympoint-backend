import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class ManagementMail {
  get key() {
    return 'ManagementMail';
  }

  async handle({ data }) {
    const { student, plans, management } = data;

    console.log(data);
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `Plano ${plans.title} contratado`,
      template: 'management',
      context: {
        student: student.name,
        finalDate: format(parseISO(management.endDate), "'dia' dd 'de ' MMMM"),
        totalPrice: management.finalPrice,
      },
    });
  }
}

export default new ManagementMail();
