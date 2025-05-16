// scripts/clear-subs.js
require('dotenv').config();
const prisma = require('../prisma/client');

(async () => {
  try {
    // Удаляем все записи из Subscription
    const deleted = await prisma.subscription.deleteMany();
    console.log(`Deleted ${deleted.count} subscriptions.`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();

