import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import bodyParser from "body-parser";
import router from './src/routes/routes';

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;

app.use('/', router)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});