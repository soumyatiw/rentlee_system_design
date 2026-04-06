import { Router } from 'express';
import { getPendingListers, getAllListers, approveLister, rejectLister, suspendLister } from '../controllers/admin.controller';
import { protect, requireRole } from '../middlewares/role.middleware';

const router = Router();

// Secure entire admin sub-router
router.use(protect);
router.use(requireRole('admin'));

router.get('/listers/pending', getPendingListers);
router.get('/listers', getAllListers);

router.patch('/listers/:id/approve', approveLister);
router.patch('/listers/:id/reject', rejectLister);
router.patch('/listers/:id/suspend', suspendLister);

export default router;
