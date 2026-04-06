import { Router } from 'express';
import { registerUser, registerLister, login } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Express Rate Limiter: max 10 requests per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes', statusCode: 429 },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware to evaluate validation chains
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, statusCode: 400 });
  }
  next();
};

const registerValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validateRequest
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

router.post('/register/user', authLimiter, registerValidation, registerUser);
router.post('/register/lister', authLimiter, registerValidation, registerLister);
router.post('/login', authLimiter, loginValidation, login);

export default router;
