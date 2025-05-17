const { randomUUID } = require('crypto');
const prisma = require('../prisma/client');
const Mailer = require('../utils/mailer');

class SubscriptionService {
  async subscribe({ email, city, frequency }) {
    // 1. Проверяем, есть ли дубли
    const existing = await prisma.subscription.findFirst({
      where: { email, city: { name: city } },
      include: { city: true }
    });
    if (existing) {
      const err = new Error('Email already subscribed');
      err.status = 409;
      throw err;
    }

    // 2. Найти или создать город
    let cityRec = await prisma.city.findUnique({ where: { name: city } });
    if (!cityRec) {
      cityRec = await prisma.city.create({ data: { name: city } });
    }

    // 3. Сгенерировать токен
    const token = randomUUID();

    // 4. Создать подписку
    await prisma.subscription.create({
      data: {
        email,
        frequency,
        token,
        city: { connect: { id: cityRec.id } },
      },
    });

    // 5. Сформировать ссылки
    const confirmLink     = `${process.env.APP_URL}/confirm/${token}`;
    const unsubscribeLink = `${process.env.APP_URL}/unsubscribe/${token}`;


	/*  
    // 6. Отправить письмо с подтверждением и ссылкой на отписку
    const subject = 'Підтвердіть підписку на оновлення погоди';
    const text =
      `Вітаємо!\n\n` +
      `Щоб підтвердити підписку на місто "${city}", перейдіть за посиланням:\n` +
      `${confirmLink}\n\n` +
      `Якщо ви передумаєте, ви завжди можете відписатися:\n` +
      `${unsubscribeLink}\n\n` +
      `Дякуємо, що користуєтеся нашим сервісом!`;
    await Mailer.send(email, subject, text);

    // 7. Вернуть ответ клиенту
    return {
      message: 'Лист із підтвердженням та посиланням для відписки надіслано на ваш e-mail.'
    };*/

	  // После prisma.subscription.create и генерации confirmLink / unsubscribeLink

// 5. Сформировать тему и тело письма
const subject = 'Підтвердіть підписку на оновлення погоди';

const text =
  `Вітаємо!\n\n` +
  `Підтвердіть підписку на місто "${city}" за цим посиланням:\n${confirmLink}\n\n` +
  `Щоб відписатися, перейдіть по цьому лінку:\n${unsubscribeLink}`;

const html = `
  <p>Вітаємо!</p>
  <p>Щоб підтвердити підписку на місто "<strong>${city}</strong>", натисніть на посилання:</p>
  <p><a href="${confirmLink}">✅ Підтвердити підписку</a></p>
  <hr/>
  <p>Якщо ви передумаєте, ви можете <a href="${unsubscribeLink}">відписатися тут</a>.</p>
  <p>Дякуємо, що користуєтеся нашим сервісом!</p>
`;

// 6. Отправляем письмо в двух форматах — текстовом и HTML
await Mailer.send(email, subject, text, html);

// 7. Возвращаем ответ клиенту
return {
  message: 'Лист із підтвердженням та кнопкою для відписки надіслано на ваш e-mail.'
};

  }

  async confirm(token) {
    const sub = await prisma.subscription.findUnique({ where: { token } });
    if (!sub) {
      const err = new Error('Token not found');
      err.status = 404;
      throw err;
    }
    await prisma.subscription.update({
      where: { token },
      data: { confirmed: true },
    });
    return { message: 'Subscription confirmed' };
  }

  async unsubscribe(token) {
    const sub = await prisma.subscription.findUnique({ where: { token } });
    if (!sub) {
      const err = new Error('Token not found');
      err.status = 404;
      throw err;
    }
    await prisma.subscription.delete({ where: { token } });
    return { message: 'Unsubscribed successfully' };
  }
}

module.exports = new SubscriptionService();

