// client/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostDetails from './pages/PostDetails';
import AdminDashboard from './pages/AdminDashboard';


function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
