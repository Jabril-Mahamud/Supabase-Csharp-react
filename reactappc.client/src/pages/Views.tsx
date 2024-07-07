import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, IconButton, Card, CardContent, CardMedia, Typography, Stack, Box, Avatar } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import ReactPlayer from 'react-player';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    date: string;
    time: string;
}

const Views: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Playlist>>({});

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const response = await fetch('https://localhost:7294/api/Playlist');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPlaylists(data);
        } catch (error) {
            console.error('Fetching error:', error);
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
            fetchPlaylists();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await fetch('https://localhost:7294/api/Playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Create failed');
            }
            fetchPlaylists();
            handleDialogClose();
        } catch (error) {
            console.error('Create error:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Video Feed
            </Typography>
            <Stack spacing={2}>
                {playlists.map((playlist) => (
                    <Card key={playlist.id} sx={{ boxShadow: 1 }}>
                        <CardContent sx={{ paddingBottom: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                                <Avatar sx={{ marginRight: 2 }}>
                                    {playlist.app[0].toUpperCase()}
                                </Avatar>
                                <Typography variant="subtitle1" component="span" sx={{ flexGrow: 1 }}>
                                    {playlist.app}
                                </Typography>
                                <IconButton size="small">
                                    <MoreVertIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                        <CardMedia>
                            <ReactPlayer
                                url={playlist.sauce}
                                width="100%"
                                height="300px"
                                controls
                            />
                        </CardMedia>
                        <CardContent>
                            <Typography variant="body2" component="p" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                {playlist.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="p">
                                {new Date(playlist.date).toLocaleDateString()} at {new Date(`1970-01-01T${playlist.time}`).toLocaleTimeString('en-UK', { hour12: false })}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 1 }}>
                                <IconButton size="small" onClick={() => handleDelete(playlist.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
            <Box sx={{ marginTop: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                >
                    Add Playlist
                </Button>
            </Box>

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
                            label="Content (YouTube URL)"
                            type="text"
                            fullWidth
                            value={formData.content || ''}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Sauce"
                            type="text"
                            fullWidth
                            value={formData.sauce || ''}
                            onChange={(e) => setFormData({ ...formData, sauce: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="App"
                            type="text"
                            fullWidth
                            value={formData.app || ''}
                            onChange={(e) => setFormData({ ...formData, app: e.target.value })}
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
        </Box>
    );
};

export default Views;