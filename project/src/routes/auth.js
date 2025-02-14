import express from 'express';
import { login } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginValidator } from '../validators/user.validator.js';

const router = express.Router();

router.post('/login', validate(loginValidator), login);

export { router as authRouter };