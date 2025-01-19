"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_config_1 = __importDefault(require("../src/configs/prisma.config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const faker_1 = require("@faker-js/faker");
const date_fns_1 = require("date-fns");
const unitNames = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];
const roleNames = ['Role 1', 'Role 2', 'Role 3', 'Role 4', 'Role 5'];
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    // Generate units
    const units = yield Promise.all(unitNames.map((name) => prisma_config_1.default.unit.create({
        data: {
            name,
            description: faker_1.faker.company.catchPhrase(),
            isActive: true,
        },
    })));
    // Generate roles
    const roles = yield Promise.all(roleNames.map((name) => prisma_config_1.default.role.create({
        data: {
            name,
            description: faker_1.faker.company.catchPhrase(),
            isActive: true,
        },
    })));
    // Generate employees
    const employees = yield Promise.all(Array.from({ length: 10 }).map(() => prisma_config_1.default.employee.create({
        data: {
            username: faker_1.faker.internet.userName(),
            fullName: faker_1.faker.person.fullName(),
            password: bcryptjs_1.default.hashSync(faker_1.faker.internet.password(), 8),
            isAdmin: faker_1.faker.datatype.boolean(),
            joinAt: faker_1.faker.date.between({
                from: (0, date_fns_1.subYears)(new Date(), 1),
                to: new Date(),
            }),
        },
    })));
    // Generate employee unit roles
    yield Promise.all(Array.from({ length: 10 }).map(() => prisma_config_1.default.employeeUnitRole.create({
        data: {
            employeeId: employees[Math.floor(Math.random() * employees.length)].id,
            unitId: units[Math.floor(Math.random() * units.length)].id,
            roleId: roles[Math.floor(Math.random() * roles.length)].id,
            isActive: true,
        },
    })));
    // Generate auth logs
    yield Promise.all(Array.from({ length: 200 }).map(() => prisma_config_1.default.authLog.create({
        data: {
            employeeId: employees[Math.floor(Math.random() * employees.length)].id,
            transaction: 'Login',
            isSucceed: true,
            authAt: faker_1.faker.date.between({
                from: (0, date_fns_1.subYears)(new Date(), 1),
                to: new Date(),
            }),
        },
    })));
    // Create admin user
    yield prisma_config_1.default.employee.create({
        data: {
            username: 'admin',
            fullName: 'Admin User',
            password: bcryptjs_1.default.hashSync('Rahasia@123', 8),
            isAdmin: true,
            joinAt: new Date(),
        },
    });
    console.log('Seeding finished.');
});
seed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_config_1.default.$disconnect();
}));
//# sourceMappingURL=seed.js.map