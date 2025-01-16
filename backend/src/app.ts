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

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
