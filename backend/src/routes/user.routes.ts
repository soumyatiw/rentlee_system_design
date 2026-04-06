import { Router } from 'express';
import {
  getMe,
  updateMe,
  saveProperty,
  unsaveProperty,
  getSavedProperties,
} from '../controllers/user.controller';
import { protect, requireRole } from '../middlewares/role.middleware';

const router = Router();

// Generic protected user profile routes (allowed for all authenticated users)
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// Normal user endpoints strictly for "user" role
const userOnlyAuth = [protect, requireRole('user')];

router.get('/saved', userOnlyAuth, getSavedProperties);
router.post('/saved/:propertyId', userOnlyAuth, saveProperty);
router.delete('/saved/:propertyId', userOnlyAuth, unsaveProperty);

export default router;
