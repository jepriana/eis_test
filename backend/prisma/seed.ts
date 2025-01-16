import prisma from '../src/configs/prisma.config';
import bcrypt from "bcryptjs"

async function main() {
    const password = await bcrypt.hash('Rahasia@123', 8);
  // Seed data
  const users = [
    { username: 'admin', fullName: 'Admin', password: password, isAdmin: true },
    { username: 'jepriana', fullName: 'Wayan Jepriana', password: password },
  ];

  for (const user of users) {
    await prisma.employee.create({ data: user });
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
