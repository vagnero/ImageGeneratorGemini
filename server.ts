import express from 'express';
import bodyParser from 'body-parser';
const app = express();
require('dotenv').config();
const port = process.env.PORT;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import measureRouter from './src/routes/MeasureRoutes';

app.use(measureRouter);




app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
  })