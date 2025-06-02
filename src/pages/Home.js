import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await apiFetch('/api/posts');
            setPosts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;

    if (error)
        return (
            <div style={{ color: 'red', margin: '1rem 0' }}>
                <p>Error: {error}</p>
                <button onClick={fetchPosts} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    Retry
                </button>
            </div>
        );

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>All Blog Posts</h1>
            {posts.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No posts available</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {posts.map(post => (
                        <li
                            key={post._id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '1rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <h2 style={{ margin: '0 0 0.5rem' }}>
                                <Link to={`/posts/${post._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                                    {post.title}
                                </Link>
                            </h2>
                            <p style={{ margin: '0 0 0.5rem', color: '#555' }}>
                                {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#888' }}>
                                By <strong>{post.author.username}</strong> on{' '}
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <Link
                                to={`/posts/${post._id}`}
                                style={{
                                    display: 'inline-block',
                                    marginTop: '0.5rem',
                                    color: '#007bff',
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                }}
                            >
                                Read more
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Home;
