import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Container, Box, Button, CircularProgress } from '@mui/material';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('/api/auth/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" className="mb-4">
                    Welcome to your Dashboard
                </Typography>
                <Box className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <Typography variant="h6" className="mb-2">User Information</Typography>
                    <Typography>Email: {user.email}</Typography>
                    <Typography>User ID: {user.id}</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    className="mt-4"
                >
                    Logout
                </Button>
            </Box>
        </Container>
    );
}

export default Dashboard;