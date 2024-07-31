import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Playlist from './pages/Playlist';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Navbar from './components/Navbar/Navbar';
import Views from './pages/Views';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Auth/Dashboard';
import { AuthProvider } from './components/Auth/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
    <AuthProvider>
        <Router>
            <Navbar />
            <div className="mt-16">
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/views" element={<Views />} />
                </Routes>
            </div>
            </Router>
        </AuthProvider>
    </React.StrictMode>,
);
