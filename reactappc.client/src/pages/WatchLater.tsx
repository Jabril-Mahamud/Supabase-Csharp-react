import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistCard from '../components/Playlist/PlaylistCard';
import PlaylistDialog from '../components/Playlist/PlaylistDialog';
import PlaylistTable from '../components/Playlist/PlaylistTable';
import { getAppFromUrl, sortPlaylists } from '../services/utils';
import { fetchAllPlaylists, fetchIdPlaylists, deletePlaylist, createPlaylist, fetchUserId } from '../services/playlistService';
import { useAuth } from '../components/Auth/AuthContext';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    date: string;
    time: string;
}

const WatchLater: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Playlist>>({});
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('dateDesc');
    const [viewOption, setViewOption] = useState<'playlist' | 'views'>('playlist');

    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                if (isLoggedIn) {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        logout();
                        return;
                    }
                    const user = await fetchUserId(token);
                    if (user.id) {
                        const userPlaylists = await fetchIdPlaylists(user.id);
                        setPlaylists(sortPlaylists(userPlaylists, sortOption));
                    }
                } else {
                    const allPlaylists = await fetchAllPlaylists();
                    setPlaylists(sortPlaylists(allPlaylists, sortOption));
                }
            } catch (error) {
                console.error('Fetching error:', error);
            }
        };

        loadPlaylists();
    }, [isLoggedIn, logout, sortOption, viewOption]);

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
            const newPlaylist = { ...formData, app };
            await createPlaylist(newPlaylist);
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
        <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {viewOption === 'playlist' ? 'Playlists' : 'Video Feed'}
            </Typography>

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 2,
                padding: 2,
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                gap: 2,
                height: 56
            }}>
                <Button
                    variant="outlined"
                    onClick={() => setViewOption(viewOption === 'playlist' ? 'views' : 'playlist')}
                    sx={{ flex: 1, height: '100%', fontSize: '0.875rem' }}
                >
                    {viewOption === 'playlist' ? 'Switch to Views' : 'Switch to Playlists'}
                </Button>

                {isLoggedIn && viewOption === 'playlist' && (
                    <FormControl sx={{ flex: 1, marginRight: 2 }}>
                        <InputLabel id="sort-select-label">Sort by</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            value={sortOption}
                            label="Sort by"
                            onChange={(e) => setSortOption(e.target.value)}
                            sx={{ height: '100%', fontSize: '0.875rem' }}
                        >
                            <MenuItem value="dateDesc">Newest First</MenuItem>
                            <MenuItem value="dateAsc">Oldest First</MenuItem>
                            <MenuItem value="contentAsc">Content (A-Z)</MenuItem>
                            <MenuItem value="contentDesc">Content (Z-A)</MenuItem>
                        </Select>
                    </FormControl>
                )}

                {isLoggedIn && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ flex: 1, height: '100%', fontSize: '0.875rem' }}
                    >
                        Create Playlist
                    </Button>
                )}
            </Box>

            {viewOption === 'playlist' ? (
                isLoggedIn ? (
                    <Stack spacing={2}>
                        {playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                onDelete={handleDelete}
                                aspectRatio={16 / 9}
                            />
                        ))}
                    </Stack>
                ) : (
                    <PlaylistTable playlists={playlists} handleDelete={handleDelete} />
                )
            ) : (
                <Box>
                    <PlaylistTable playlists={playlists} handleDelete={handleDelete} />
                </Box>
            )}

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
        </Box>
    );
};

export default WatchLater;

