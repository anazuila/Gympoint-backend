import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class ManagementMail {
  get key() {
    return 'ManagementMail';
  }

  async handle({ data }) {
    const { student, plans, endDate, finalPrice } = data;

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: `Plano ${plans.title} contratado`,
      template: 'management',
      context: {
        student: student.name,
        finalDate: format(parseISO(endDate), "'dia' dd 'de ' MMMM", {
          locale: pt,
        }),
        totalPrice: finalPrice,
      },
    });
  }
}

export default new ManagementMail();
