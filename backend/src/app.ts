import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { appModules } from './modules'
import dotenv from 'dotenv'
dotenv.config()

// Swagger Configuration
import swaggerFile from '../swagger_output.json';

const app = express()

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: 'Welcome to SIADE Web API'
  });
});

appModules(app);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

app.listen(PORT, HOSTNAME, () => console.log(`Server is running on http://${HOSTNAME}:${PORT}`))
