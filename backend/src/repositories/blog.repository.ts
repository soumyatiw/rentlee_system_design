import Blog, { IBlog } from '../models/blog.model';

class BlogRepository {
  async findAll(page: number, limit: number, tag?: string) {
    const query: Partial<{ published: boolean; tags: string }> = { published: true };
    if (tag) query.tags = tag;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findBySlug(slug: string) {
    return Blog.findOne({ slug, published: true }).populate('author', 'username avatar');
  }

  async findById(id: string) {
    return Blog.findById(id).populate('author', 'username avatar');
  }

  async create(data: Partial<IBlog>) {
    return Blog.create(data);
  }

  async update(id: string, data: Partial<IBlog>) {
    return Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string) {
    return Blog.findByIdAndDelete(id);
  }
}

export default new BlogRepository();
