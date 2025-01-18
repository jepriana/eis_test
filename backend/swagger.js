// eslint-disable-next-line @typescript-eslint/no-require-imports
const swaggerAutogen = require('swagger-autogen');
const routes = [
  './src/modules/auth/auth.routes.ts',
  './src/modules/master/employees/employee.routes.ts',
  './src/modules/master/units/unit.routes.ts',
  './src/modules/master/roles/role.routes.ts',
  './src/modules/master/employee-unit-roles/employee-unit-role.routes.ts',
  './src/modules/master/logs/log.routes.ts',
  './src/modules/dashboard/dashboard.routes.ts'
];

const doc = {
    info: {
      title: 'EIS Puri Bunda API',
      description: 'Sistem Informasi Kepegawaian Puri Bunda'
    },
    host: 'localhost:3001',
  };
  

const outputFile = './swagger_output.json'
const endpointsFiles = routes
console.log(endpointsFiles)

swaggerAutogen(outputFile, endpointsFiles, doc)