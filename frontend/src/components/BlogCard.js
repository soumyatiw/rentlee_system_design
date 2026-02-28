
'use client';

import { useState } from 'react';
import blogPosts from '@/data/BlogData';
import ReactMarkdown from 'react-markdown';
import styles from './BlogCard.module.css';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function BlogPage() {
    const [selectedPost, setSelectedPost] = useState(null);


    return (
        <div className={styles.blogWrapper}>
            <h1 className={styles.heading}>Latest Articles</h1>

            <div className={styles.cardContainer}>
                {blogPosts.map((post) => (
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

            {selectedPost && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setSelectedPost(null)}
                        >
                            &times;
                        </button>
                        <h2 className={styles.modalTitle}>{selectedPost.title}</h2>
                        <p className={styles.metaText}>
                            By {selectedPost.author} •{' '}
                            {new Date(selectedPost.date).toLocaleDateString()}
                        </p>
                        <img
                            src={selectedPost.image}
                            alt={selectedPost.title}
                            className={styles.modalImage}
                        />
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            
                        >
                            {selectedPost?.content || ""}
                        </ReactMarkdown>

                    </div>
                </div>
            )}
        </div>
    );
}
