import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const Dashboard = () => {
    const { user, token } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ title: '', content: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    const fetchPosts = useCallback(async () => {
        if (!user) return;

        // Fix template literal, and always use relative URLs
        const url = user.role === 'admin'
            ? '/api/posts'
            : `/api/posts/user/${user.id || user._id}`;  // fallback to user._id if user.id undefined

        try {
            const res = await apiFetch(url, 'GET', null, token);
            setPosts(res);
        } catch (err) {
            setError(err.message || 'Failed to fetch posts');
        }
    }, [user, token]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Use relative URLs only
        const url = editingId ? `/api/posts/${editingId}` : '/api/posts';

        const method = editingId ? 'PUT' : 'POST';

        try {
            await apiFetch(url, method, form, token);
            setForm({ title: '', content: '' });
            setEditingId(null);
            fetchPosts();
        } catch (err) {
            setError(err.message || 'Error submitting post');
        }
    };

    const handleEdit = (post) => {
        setForm({ title: post.title, content: post.content });
        setEditingId(post._id);
    };

    const handleCancel = () => {
        setForm({ title: '', content: '' });
        setEditingId(null);
        setError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await apiFetch(`/api/posts/${id}`, 'DELETE', null, token);
            fetchPosts();
        } catch (err) {
            alert(err.message || 'Error deleting post');
        }
    };

    if (!user) return <p>Loading user info...</p>;

    return (
        <div style={{ maxWidth: 700, margin: 'auto', padding: '1rem' }}>
            <h2>{user.role === 'admin' ? 'Admin Dashboard' : 'My Posts'}</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    value={form.content}
                    onChange={handleChange}
                    rows="5"
                    required
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                />
                <button type="submit" style={{ marginRight: '1rem' }}>
                    {editingId ? 'Update Post' : 'Create Post'}
                </button>
                {editingId && (
                    <button type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                )}
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {posts.length === 0 ? (
                <p>No posts available.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {posts.map(post => (
                        <li
                            key={post._id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                padding: '1rem',
                                marginBottom: '1rem',
                                backgroundColor: '#fafafa',
                            }}
                        >
                            <h3>{post.title}</h3>
                            <p>{post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}</p>
                            <p style={{ fontSize: '0.85rem', color: '#555' }}>
                                By {post.author.username} — {new Date(post.createdAt).toLocaleDateString()}
                            </p>

                            {(post.author._id === (user.id || user._id) || user.role === 'admin') && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    {post.author._id === (user.id || user._id) && (
                                        <button onClick={() => handleEdit(post)} style={{ marginRight: '0.5rem' }}>
                                            Edit
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(post._id)}>Delete</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
