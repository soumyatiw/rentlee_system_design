import { Request, Response, NextFunction } from 'express';
import blogService from '../services/blog.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const getAllBlogs = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { page = '1', limit = '9', tag } = req.query as Record<string, string>;
    const result = await blogService.getAllBlogs(parseInt(page), parseInt(limit), tag);
    sendSuccess(res, result, 'Blogs fetched successfully');
  }
);

export const getBlogBySlug = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const blog = await blogService.getBlogBySlug(req.params.slug);
    sendSuccess(res, blog, 'Blog fetched successfully');
  }
);

export const createBlog = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const blog = await blogService.createBlog({ ...req.body, author: userId });
    sendSuccess(res, blog, 'Blog created successfully', 201);
  }
);

export const updateBlog = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    const blog = await blogService.updateBlog(req.params.id, req.body, userId);
    sendSuccess(res, blog, 'Blog updated successfully');
  }
);

export const deleteBlog = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = (req as any).user?.id;
    await blogService.deleteBlog(req.params.id, userId);
    sendSuccess(res, null, 'Blog deleted successfully');
  }
);
