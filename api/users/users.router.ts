import express              from 'express';
import { login, register }  from './users.controller';
import { validateToken } from '../auth/auth';

const router = express.Router();

router.post("/login", login);
router.post("/register", validateToken, register);

export {router as userRouter}