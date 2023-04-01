import express                  from 'express';
import { createCategory }       from './subCategories.controller';

const router = express.Router();

router.post("/:id_category", createCategory);

export {router as subCategoriesRouter}