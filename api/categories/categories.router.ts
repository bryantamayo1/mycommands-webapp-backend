import express from 'express';
import { searchCommands } from './categories.controller';
const router = express.Router();

router.get("/:lang", searchCommands);

export {router as categoriesRouter}