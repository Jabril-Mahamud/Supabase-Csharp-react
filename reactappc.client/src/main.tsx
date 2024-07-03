// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Playlist from './playlist';
import './index.css';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Navbar from './Navbar/Navbar';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/home" element={<Home />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/About" element={<About />} />

            </Routes>
        </Router>
    </React.StrictMode>,
);
