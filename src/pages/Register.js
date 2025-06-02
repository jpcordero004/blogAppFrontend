import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await apiFetch('/api/register', 'POST', form);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '400px',
            margin: '4rem auto',
            padding: '2rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>

            {error && (
                <p style={{
                    color: 'red',
                    marginBottom: '1rem',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <label htmlFor="username" style={{ display: 'block', marginBottom: '0.3rem' }}>
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                    }}
                />

                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.3rem' }}>
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                    }}
                />

                <label htmlFor="password" style={{ display: 'block', marginBottom: '0.3rem' }}>
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '1rem'
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register;
