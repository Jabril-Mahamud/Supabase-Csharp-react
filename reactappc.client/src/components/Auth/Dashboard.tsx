import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Typography, Container, Box, Button, CircularProgress } from '@mui/material';

interface User {
    id: string;
    email: string;
    // Add other user properties as needed
}

function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get<User>('https://localhost:7294/api/Auth/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    console.error('Error response:', axiosError.response);
                }
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
                {user && (
                    <Box className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <Typography variant="h6" className="mb-2">User Information</Typography>
                        <Typography>Email: {user.email}</Typography>
                        <Typography>User ID: {user.id}</Typography>
                    </Box>
                )}
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