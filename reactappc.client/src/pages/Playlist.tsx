import React, { useEffect, useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../components/Auth/AuthContext';
import PlaylistTable from '../components/Playlist/PlaylistTable';
import PlaylistDialog from '../components/Playlist/PlaylistDialog';
import { fetchUserId, fetchIdPlaylists, deletePlaylist, createPlaylist } from '../services/playlistService';
import { getAppFromUrl } from '../services/utils';

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
        const loadUserIdAndPlaylists = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    logout();
                    return;
                }
                const user = await fetchUserId(token);
                setUserId(user.id);
                const playlists = await fetchIdPlaylists(user.id);
                setPlaylists(playlists);
            } catch (error) {
                console.error('Error loading user ID and playlists:', error);
            }
        };

        if (isLoggedIn) {
            loadUserIdAndPlaylists();
        }
    }, [isLoggedIn, logout]);

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
            await deletePlaylist(id);
            if (userId) {
                const playlists = await fetchIdPlaylists(userId);
                setPlaylists(playlists);
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
            const newPlaylist = { ...formData, app, user_id: userId };
            await createPlaylist(newPlaylist);
            if (userId) {
                const playlists = await fetchIdPlaylists(userId);
                setPlaylists(playlists);
            }
            handleDialogClose();
            showSnackbar('Playlist created successfully');
        } catch (error) {
            console.error('Create error:', error);
            showSnackbar('Error creating playlist');
        }
    };

    const handleFormDataChange = (field: keyof Playlist, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const showSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <h1>Playlists</h1>
            <PlaylistTable playlists={playlists} handleDelete={handleDelete} />
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreate}
            >
                Create Playlist
            </Button>

            <PlaylistDialog
                open={dialogOpen}
                formData={formData}
                onClose={handleDialogClose}
                onChange={handleFormDataChange}
                onSubmit={handleSubmit}
            />

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
