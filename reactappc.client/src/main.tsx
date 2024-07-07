import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Playlist from './pages/Playlist';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Navbar from './Navbar/Navbar';
import Views from './pages/Views';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Navbar />
            <div className="mt-16">
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/views" element={<Views />} />
                </Routes>
            </div>
        </Router>
    </React.StrictMode>,
);
