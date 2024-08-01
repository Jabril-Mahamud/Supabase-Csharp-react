import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    IconButton,
    Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { useAuth } from '../components/Auth/AuthContext';  // Import the authentication context

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    date: string;
    time: string;
}

const Playlist: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Playlist>>({});
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    logout();
                    return;
                }
                const response = await fetch('https://localhost:7294/api/Auth/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const user = await response.json();
                setUserId(user.id);
                fetchPlaylists(user.id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        if (isLoggedIn) {
            fetchUserId();
        }
    }, [isLoggedIn, logout]);

    const fetchPlaylists = async (userId: string) => {
        try {
            const response = await fetch(`https://localhost:7294/api/Playlist/user/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPlaylists(data);
        } catch (error) {
            console.error('Fetching error:', error);
            showSnackbar('Error fetching playlists');
        }
    };

    const getAppFromUrl = (url: string): string => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'YouTube';
        } else if (url.includes('vimeo.com')) {
            return 'Vimeo';
        } else if (url.includes('dailymotion.com')) {
            return 'Dailymotion';
        } else if (url.includes('twitch.tv')) {
            return 'Twitch';
        } else if (url.includes('instagram.com')) {
            return 'Instagram';
        } else {
            return 'Unknown';
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFormData({});
    };

    const handleCreate = () => {
        setFormData({});
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`https://localhost:7294/api/Playlist/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Delete failed');
            }
            if (userId) {
                fetchPlaylists(userId);
            }
            showSnackbar('Playlist deleted successfully');
        } catch (error) {
            console.error('Delete error:', error);
            showSnackbar('Error deleting playlist');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const app = getAppFromUrl(formData.sauce || '');
            const response = await fetch('https://localhost:7294/api/Playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, app, user_id: userId }),  // Add app and user_id to the formData
            });
            if (!response.ok) {
                throw new Error('Create failed');
            }
            if (userId) {
                fetchPlaylists(userId);
            }
            handleDialogClose();
            showSnackbar('Playlist created successfully');
        } catch (error) {
            console.error('Create error:', error);
            showSnackbar('Error creating playlist');
        }
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'content', headerName: 'Content', width: 150 },
        { field: 'sauce', headerName: 'Sauce', flex: 1 },
        { field: 'app', headerName: 'App', width: 150 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'time', headerName: 'Time', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <IconButton onClick={() => handleDelete(params.row.id)} color="secondary">
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const rows: GridRowsProp = playlists.map((playlist) => ({
        id: playlist.id,
        content: playlist.content,
        sauce: playlist.sauce,
        app: playlist.app,
        date: new Date(playlist.date).toLocaleDateString(),
        time: new Date(`1970-01-01T${playlist.time}`).toLocaleTimeString('en-US', { hour12: false }),
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <h1>Playlists</h1>
            <div style={{ flexGrow: 1, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
            </div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreate}
            >
                Create Playlist
            </Button>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Create Playlist</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <DialogContentText>
                            Enter the new playlist details
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Content"
                            type="text"
                            fullWidth
                            value={formData.content || ''}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Sauce (Video URL)"
                            type="text"
                            fullWidth
                            value={formData.sauce || ''}
                            onChange={(e) => {
                                const url = e.target.value;
                                setFormData({
                                    ...formData,
                                    sauce: url,
                                    app: getAppFromUrl(url),  // Automatically set the app based on the URL
                                });
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </div>
    );
};

export default Playlist;
