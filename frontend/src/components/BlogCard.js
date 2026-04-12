
'use client';

import { useState } from 'react';
import blogPosts from '@/data/BlogData';
import ReactMarkdown from 'react-markdown';
import styles from './BlogCard.module.css';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function BlogPage({ searchQuery = '' }) {
    const [selectedPost, setSelectedPost] = useState(null);

    const filteredPosts = blogPosts.filter((post) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        return (
            post.title?.toLowerCase().includes(q) ||
            post.description?.toLowerCase().includes(q) ||
            post.author?.toLowerCase().includes(q)
        );
    });

    return (
        <div className={styles.blogWrapper}>
            <h1 className={styles.heading}>Latest Articles</h1>

            {filteredPosts.length === 0 ? (
                <p className={styles.noResults}>
                    No articles found for &quot;{searchQuery}&quot;.
                </p>
            ) : (
                <div className={styles.cardContainer}>
                    {filteredPosts.map((post) => (
                        <div className={styles.card} key={post.id}>
                            <img src={post.image} alt={post.title} className={styles.thumbnail} />
                            <div className={styles.content}>
                                <span className={styles.category}>Featured</span>
                                <h2 className={styles.title}>{post.title}</h2>
                                <p className={styles.description}>{post.description}</p>
                                <div className={styles.wrap}>
                                    <div className={styles.meta}>
                                        <span>{post.author}</span>
                                        <span>{post.date}</span>
                                    </div>
                                    <button
                                        className={styles.readMore}
                                        onClick={() => setSelectedPost(post)}
                                    >
                                        Read More &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedPost && (
                <div className={styles.modalOverlay} onClick={() => setSelectedPost(null)}>
                    <article className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                        {/* ── Hero Image with gradient overlay ── */}
                        <div className={styles.modalHero}>
                            <img
                                src={selectedPost.image}
                                alt={selectedPost.title}
                                className={styles.modalHeroImg}
                            />
                            <div className={styles.modalHeroOverlay} />
                            <button
                                className={styles.closeBtn}
                                onClick={() => setSelectedPost(null)}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>

                        {/* ── Header ── */}
                        <div className={styles.modalHeader}>
                            <span className={styles.modalCategory}>Featured</span>
                            <h2 className={styles.modalTitle}>{selectedPost.title}</h2>
                            <div className={styles.modalMeta}>
                                <div className={styles.authorChip}>
                                    <span className={styles.authorAvatar}>
                                        {selectedPost.author?.[0]?.toUpperCase()}
                                    </span>
                                    <span className={styles.authorName}>{selectedPost.author}</span>
                                </div>
                                <span className={styles.modalDate}>
                                    {new Date(selectedPost.date).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className={styles.divider} />
                        </div>

                        {/* ── Body (markdown) ── */}
                        <div className={styles.modalBody}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({ node, ...props }) => <h1 className={styles.mdH1} {...props} />,
                                    h2: ({ node, ...props }) => <h2 className={styles.mdH2} {...props} />,
                                    h3: ({ node, ...props }) => <h3 className={styles.mdH3} {...props} />,
                                    p:  ({ node, ...props }) => <p  className={styles.mdP}  {...props} />,
                                    ul: ({ node, ...props }) => <ul className={styles.mdUl} {...props} />,
                                    ol: ({ node, ...props }) => <ol className={styles.mdOl} {...props} />,
                                    li: ({ node, ...props }) => <li className={styles.mdLi} {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote className={styles.mdBlockquote} {...props} />,
                                    strong: ({ node, ...props }) => <strong className={styles.mdStrong} {...props} />,
                                    code: ({ node, ...props }) => <code className={styles.mdCode} {...props} />,
                                    hr: () => <hr className={styles.mdHr} />,
                                }}
                            >
                                {selectedPost?.content || ''}
                            </ReactMarkdown>
                        </div>

                    </article>
                </div>
            )}
        </div>
    );
}
