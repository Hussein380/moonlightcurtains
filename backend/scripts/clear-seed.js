const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const orders = await p.order.deleteMany({});
  const requests = await p.customRequest.deleteMany({});
  console.log('Deleted orders:', orders.count);
  console.log('Deleted requests:', requests.count);
}

main().then(() => p.$disconnect()).catch(e => { console.error(e.message); p.$disconnect(); });
