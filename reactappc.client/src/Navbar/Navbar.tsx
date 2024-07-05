import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                        Watch later App
                    </Link>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/about">
                        About
                    </Button>
                    <Button color="inherit" component={Link} to="/views">
                        Views
                    </Button>
                    <Button color="inherit" component={Link} to="/contact">
                        Contact
                    </Button>
                    <Button color="inherit" component={Link} to="/playlist">
                        Playlist
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
