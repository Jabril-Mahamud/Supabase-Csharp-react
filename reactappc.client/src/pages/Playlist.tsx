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
    Card,
    CardContent,
    Typography,
    Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
        <div style={{ padding: '20px' }}>
            <h1>Views</h1>
            <Grid container spacing={3}>
                {playlists.map((playlist) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={playlist.id}>
                        <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                                <ReactPlayer
                                    url={playlist.sauce}
                                    width="100%"
                                    height="100%"
                                    controls
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                />
                            </div>
                            <CardContent style={{ flexGrow: 1 }}>
                                <Typography variant="h6">{playlist.content}</Typography>
                                <Typography variant="body2">{playlist.app}</Typography>
                                <Typography variant="body2">{new Date(playlist.date).toLocaleDateString()}</Typography>
                                <Typography variant="body2">{new Date(`1970-01-01T${playlist.time}`).toLocaleTimeString('en-UK', { hour12: false })}</Typography>
                                <IconButton onClick={() => handleDelete(playlist.id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                style={{ marginTop: '20px' }}
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
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button type="submit">Create</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default Views;
