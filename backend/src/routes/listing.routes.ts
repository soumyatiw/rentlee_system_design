import { Router } from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from '../controllers/listing.controller';
import { protect, requireRole, requireApprovedLister } from '../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected Lister routes
const listerAuth = [protect, requireRole('lister'), requireApprovedLister];

router.get('/lister/dashboard', listerAuth, getMyProperties);
router.post('/', listerAuth, createProperty);
router.put('/:id', listerAuth, updateProperty);
router.delete('/:id', listerAuth, deleteProperty);

export default router;
