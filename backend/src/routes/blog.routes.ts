import { Router } from 'express';
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller';
import { protect, requireRole, requireApprovedLister } from '../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

// Protected Lister routes
const listerAuth = [protect, requireRole('lister'), requireApprovedLister];

router.post('/', listerAuth, createBlog);
router.put('/:id', listerAuth, updateBlog);
router.delete('/:id', listerAuth, deleteBlog);

export default router;
