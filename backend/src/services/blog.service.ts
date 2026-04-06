import blogRepository from '../repositories/blog.repository';
import { IBlog } from '../models/blog.model';
import { AppError } from '../utils/AppError';
import { slugify } from '../utils/slugify';

class BlogService {
  async getAllBlogs(page: number, limit: number, tag?: string) {
    return blogRepository.findAll(page, limit, tag);
  }

  async getBlogBySlug(slug: string) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) throw new AppError('Blog post not found', 404);
    return blog;
  }

  async createBlog(data: Partial<IBlog>) {
    const slug = slugify(data.title ?? 'untitled');
    const wordsPerMin = 200;
    const wordCount = (data.content ?? '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMin);
    return blogRepository.create({ ...data, slug, readingTime });
  }

  async updateBlog(id: string, data: Partial<IBlog>, requesterId: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw new AppError('Blog post not found', 404);
    if (blog.author.toString() !== requesterId) {
      throw new AppError('Not authorized to update this blog post', 403);
    }
    if (data.title) data.slug = slugify(data.title);
    return blogRepository.update(id, data);
  }

  async deleteBlog(id: string, requesterId: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) throw new AppError('Blog post not found', 404);
    if (blog.author.toString() !== requesterId) {
      throw new AppError('Not authorized to delete this blog post', 403);
    }
    return blogRepository.delete(id);
  }
}

export default new BlogService();
