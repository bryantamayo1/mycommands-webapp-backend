import express from 'express';
import { validateToken } from '../auth/auth';
import { createFilter, findFilters } from './filters.controller';
const router = express.Router();

router
    .route("/")
    .get(findFilters)
    .post(validateToken, createFilter);

export {router as filtersRouter}