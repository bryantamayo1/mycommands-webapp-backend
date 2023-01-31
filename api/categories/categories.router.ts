import express from 'express';
import { validateToken } from '../auth/auth';
import { createCommand, searchCommands } from './categories.controller';
const router = express.Router();

router.post("/:id_filter", validateToken, createCommand);
router.get("/:lang", searchCommands);

export {router as categoriesRouter}