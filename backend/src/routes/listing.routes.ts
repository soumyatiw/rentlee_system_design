import { Router } from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  getListerStats,
} from '../controllers/listing.controller';

import { protect, requireRole, requireApprovedLister } from '../middlewares/role.middleware';

const router = Router();
const listerAuth = [protect, requireRole('lister'), requireApprovedLister];


// Specific routes (MUST come before /:id)
router.get('/lister/dashboard', listerAuth, getMyProperties);
router.get('/lister/stats', listerAuth, getListerStats);


// Generic routes
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Write routes
router.post('/', listerAuth, createProperty);
router.put('/:id', listerAuth, updateProperty);
router.delete('/:id', listerAuth, deleteProperty);


export default router;
