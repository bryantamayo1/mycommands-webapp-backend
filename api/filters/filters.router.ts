import express from 'express';
import { createFilter, findFilters } from './filters.controller';
const router = express.Router();

router
    .route("/")
    .get(findFilters)
    .post(createFilter);

export {router as filtersRouter}