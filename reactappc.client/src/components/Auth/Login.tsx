import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setSuccess('Login successful! Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" className="mb-4">
                    Login
                </Typography>
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {success && <Alert severity="success" className="mb-4">{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Link to="/register" className="text-sm text-blue-600 hover:underline">
                        Don't have an account? Sign Up
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;