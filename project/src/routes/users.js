import express from 'express';
import { register, searchUsers } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { registerValidator } from '../validators/user.validator.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validate(registerValidator), register);
router.get('/search', authenticateToken, searchUsers);

export { router as userRouter };