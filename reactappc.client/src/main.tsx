// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Playlist from './Playlist';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/playlist" element={<Playlist />} />
            </Routes>
        </Router>
    </React.StrictMode>,
);
