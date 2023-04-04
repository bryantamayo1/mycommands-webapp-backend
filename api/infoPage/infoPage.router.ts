import express from 'express';
import { updateCounterPage } from './infoPage.controller';
const router = express.Router();

router.get("/", updateCounterPage);

export {router as infoPageRouter}