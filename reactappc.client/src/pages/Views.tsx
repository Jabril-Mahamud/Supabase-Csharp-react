import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import '../css/Views.css'; // Import custom CSS for styling

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
        <div className="views-container">
            <h1 className="views-title">Video Feed</h1>
            <div className="video-feed">
                {playlists.map((playlist) => (
                    <div key={playlist.id} className="video-card">
                        <ReactPlayer
                            url={playlist.sauce}
                            width="100%"
                            height="100%"
                            controls
                        />
                        <div className="video-info">
                            <h2 className="video-content">{playlist.content}</h2>
                            <p className="video-app">{playlist.app}</p>
                            <p className="video-date">{new Date(playlist.date).toLocaleDateString()}</p>
                            <p className="video-time">{new Date(`1970-01-01T${playlist.time}`).toLocaleTimeString('en-UK', { hour12: false })}</p>
                        </div>
                        <div className="delete-button-container">
                            <IconButton onClick={() => handleDelete(playlist.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                ))}
            </div>
            <div className="create-button-container">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                >
                    Add Playlist
                </Button>
            </div>

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
        </div>
    );
};

export default Views;

