import { Router } from 'express';
import {
  createEnquiry,
  getMyEnquiries,
  markEnquiryAsRead,
} from '../controllers/enquiry.controller';
import { protect } from '../middlewares/role.middleware';

const router = Router();

router.use(protect);

router.post('/', createEnquiry);
router.get('/my', getMyEnquiries);
router.patch('/:id/read', markEnquiryAsRead);

export default router;
