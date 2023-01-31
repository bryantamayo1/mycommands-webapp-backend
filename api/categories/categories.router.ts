import express from 'express';
import { createCommand, searchCommands } from './categories.controller';
const router = express.Router();

router.post("/:id_filter", createCommand);
router.get("/:lang", searchCommands);

export {router as categoriesRouter}