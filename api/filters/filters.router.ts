import express from 'express';
import { findFilters } from './filters.controller';
const router = express.Router();

// Not use process.env.PATH_ADMIN doesn't work here
router.get("/",findFilters);

export {router as filtersRouter}