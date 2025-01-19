import prisma from '../src/configs/prisma.config';
import bcrypt from "bcryptjs"
import { faker } from '@faker-js/faker';
import { subYears } from 'date-fns';

const unitNames = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
const roleNames = ['Role 1', 'Role 2', 'Role 3', 'Role 4', 'Role 5'];

const seed = async () => {
  // Generate units
  const units = await Promise.all(
    unitNames.map((name) =>
      prisma.unit.create({
        data: {
          name,
          description: faker.company.catchPhrase(),
          isActive: true,
        },
      })
    )
  );

  // Generate roles
  const roles = await Promise.all(
    roleNames.map((name) =>
      prisma.role.create({
        data: {
          name,
          description: faker.company.catchPhrase(),
          isActive: true,
        },
      })
    )
  );

  // Generate employees
  const employees = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.employee.create({
        data: {
          username: faker.internet.userName(),
          fullName: faker.person.fullName(),
          password: bcrypt.hashSync(faker.internet.password(), 8),
          isAdmin: faker.datatype.boolean(),
          joinAt: faker.date.between({
            from: subYears(new Date(), 1),
            to: new Date(),
          }),
        },
      })
    )
  );

  // Generate employee unit roles
  await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.employeeUnitRole.create({
        data: {
          employeeId: employees[Math.floor(Math.random() * employees.length)].id,          
          unitId: units[Math.floor(Math.random() * units.length)].id,
          roleId: roles[Math.floor(Math.random() * roles.length)].id,
          isActive: true,
        },
      })
    )
  );

  // Generate auth logs
  await Promise.all(
    Array.from({ length: 200 }).map(() =>
      prisma.authLog.create({
        data: {
          employeeId: employees[Math.floor(Math.random() * employees.length)].id,
          transaction: 'Login',
          isSucceed: true,
          authAt: faker.date.between({
            from: subYears(new Date(), 1),
            to: new Date(),
          }),
        },
      })
    )
  );

  // Create admin user
  await prisma.employee.create({
    data: {
      username: 'admin',
      fullName: 'Admin User',
      password: bcrypt.hashSync('Rahasia@123', 8),
      isAdmin: true,
      joinAt: new Date(),
    },
  });

  console.log('Seeding finished.');
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
