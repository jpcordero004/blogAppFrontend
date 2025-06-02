import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const AdminDashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllPosts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiFetch('/api/posts', 'GET', null, token);
            setPosts(res);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAllPosts();
        }
    }, [user, fetchAllPosts]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await apiFetch(`/api/posts/${id}`, 'DELETE', null, token);
            setSuccessMsg('Post deleted successfully.');
            fetchAllPosts();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            alert(err.message);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user || user.role !== 'admin') return <p>Access denied</p>;

    return (
        <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Admin Dashboard - All User Posts</h2>

            {error && (
                <div style={{ backgroundColor: '#f8d7da', padding: '10px', marginBottom: '1rem', borderRadius: '5px', color: '#842029' }}>
                    {error}
                </div>
            )}

            {successMsg && (
                <div style={{ backgroundColor: '#d1e7dd', padding: '10px', marginBottom: '1rem', borderRadius: '5px', color: '#0f5132' }}>
                    {successMsg}
                </div>
            )}

            <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '1.5rem',
                    fontSize: '1rem',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                }}
            />

            {loading ? (
                <p>Loading posts...</p>
            ) : filteredPosts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {filteredPosts.map(post => (
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
                            <h3 style={{ margin: '0 0 0.5rem' }}>{post.title}</h3>
                            <p style={{ margin: '0 0 1rem' }}>
                                {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                                Posted by: <strong>{post.author?.username || 'Unknown'}</strong> on {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() => handleDelete(post._id)}
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDashboard;
