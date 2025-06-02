import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: '#282c34',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
        }}>
            <div>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    BlogApp
                </Link>
            </div>

            <div>
                <Link to="/" style={linkStyle}>Home</Link>

                {user ? (
                    <>
                        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" style={linkStyle}>Admin</Link>
                        )}
                        <button
                            onClick={handleLogout}
                            style={{
                                marginLeft: '1rem',
                                padding: '0.4rem 0.8rem',
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Logout ({user.username})
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={linkStyle}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '1rem',
    fontWeight: '500',
};

export default Navbar;
