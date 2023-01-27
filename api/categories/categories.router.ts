import express from 'express';
import { filter } from './categories.controller';
const router = express.Router();

router.get("", filter);

export {router as categoriesRouter}