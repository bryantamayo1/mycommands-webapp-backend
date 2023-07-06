import express from 'express';
import { searchCommandsByLanguage, searchCommandsGeneral } from './categories.controller';
const router = express.Router();

router.get("/", searchCommandsGeneral);
router.get("/:lang", searchCommandsByLanguage);

export {router as categoriesRouter}