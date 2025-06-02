import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const PostDetails = () => {
    const { id } = useParams();
    const { user, token } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await apiFetch(`/api/posts/${id}`);
                setPost(data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchComments = async () => {
            try {
                const data = await apiFetch(`/api/posts/${id}/comments`);
                setComments(data);
            } catch (err) {
                console.error('Failed to load comments:', err.message);
            }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const comment = await apiFetch(
                `/api/posts/${id}/comments`,
                'POST',
                { text: newComment },
                token
            );
            setComments([comment, ...comments]);
            setNewComment('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await apiFetch(`/api/posts/comment/${commentId}`, 'DELETE', null, token);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            alert('Failed to delete comment: ' + err.message);
        }
    };

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!post) return <p>Loading post...</p>;

    return (
        <div style={{ maxWidth: 700, margin: 'auto', padding: '1rem' }}>
            <h2>{post.title}</h2>
            <p><strong>Author:</strong> {post.author.username}</p>
            <p><strong>Posted on:</strong> {new Date(post.createdAt).toLocaleString()}</p>
            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

            <hr />

            <h3>Comments</h3>

            {user ? (
                <form onSubmit={handleAddComment} style={{ marginBottom: '1rem' }}>
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        rows="3"
                        placeholder="Write your comment here..."
                        required
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                    />
                    <button type="submit">Add Comment</button>
                </form>
            ) : (
                <p><em>You must be logged in to add comments.</em></p>
            )}

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {comments.map(comment => (
                        <li
                            key={comment._id}
                            style={{
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                padding: '0.75rem',
                                marginBottom: '0.75rem',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <p style={{ whiteSpace: 'pre-wrap' }}>{comment.text}</p>
                            <p style={{ fontSize: '0.85rem', color: '#555' }}>
                                — {comment.author.username}, {new Date(comment.createdAt).toLocaleString()}
                            </p>
                            {(user?.id === comment.author._id || user?.role === 'admin') && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '3px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PostDetails;
