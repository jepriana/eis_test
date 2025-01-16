// eslint-disable-next-line @typescript-eslint/no-require-imports
const swaggerAutogen = require('swagger-autogen');
const routes = [
  './src/modules/auth/auth.routes.ts',
  './src/modules/master/employees/employee.routes.ts',
  './src/modules/master/units/unit.routes.ts',
  './src/modules/master/roles/role.routes.ts',
  './src/modules/master/employee-unit-roles/employee-unit-role.routes.ts'
];

const doc = {
    info: {
      title: 'SIADE API',
      description: 'Sistem Informasi Administrasi Desa API'
    },
    host: 'localhost:3000'
  };
  

const outputFile = './swagger_output.json'
const endpointsFiles = routes
console.log(endpointsFiles)

swaggerAutogen(outputFile, endpointsFiles, doc)