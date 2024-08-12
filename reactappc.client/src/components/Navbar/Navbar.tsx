import React, { useContext, MouseEvent } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun Icon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon Icon
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { ThemeContext } from '../Theme/createTheme'; // Import ThemeContext

const Navbar: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const { darkMode, toggleTheme } = useContext(ThemeContext); // Use ThemeContext

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
        navigate('/');
    };

    const handleThemeToggle = () => {
        toggleTheme();
    };

    const menuItems = [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' },
        ...(isLoggedIn ? [{ label: 'Watch Later', to: '/watchlater' }] : []),
    ];

    const drawerList = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuItems.map((item, index) => (
                    <ListItem button key={index} component={Link} to={item.to}>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2, display: { md: 'none' } }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                            Watch Later App
                        </Link>
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {menuItems.map((item, index) => (
                            <Button key={index} color="inherit" component={Link} to={item.to}>
                                {item.label}
                            </Button>
                        ))}
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <Avatar alt="Profile" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {!(isLoggedIn) ? (
                                <>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/login">Login</MenuItem>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/register">Register</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/dashboard">Dashboard</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </>
                            )}
                            <MenuItem>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Typography
                                        variant="body1"
                                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                                        onClick={handleThemeToggle}
                                    >
                                        {darkMode ? 'Dark Theme' : 'Light Theme'}
                                    </Typography>
                                    <Tooltip title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}>
                                        <IconButton onClick={handleThemeToggle}>
                                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {drawerList()}
            </Drawer>
        </>
    );
};

export default Navbar;
