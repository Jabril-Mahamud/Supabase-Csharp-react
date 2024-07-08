import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button, IconButton, Card, CardContent, CardMedia, Typography, Stack, Box, Avatar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
    const [sortOption, setSortOption] = useState<string>('dateDesc');

    useEffect(() => {
        fetchPlaylists();
    }, []);

    useEffect(() => {
        setPlaylists(prev => sortPlaylists([...prev], sortOption));
    }, [sortOption]);

    const fetchPlaylists = async () => {
        try {
            const response = await fetch('https://localhost:7294/api/Playlist');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPlaylists(sortPlaylists(data, sortOption));
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
            await fetchPlaylists();
        } catch (error) {
            console.error('Delete error:', error);
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const app = getAppFromUrl(formData.sauce || '');
            const newPlaylist = {
                ...formData,
                app: app,
                // Remove date and time from here, they'll be set by the server
            };
            const response = await fetch('https://localhost:7294/api/Playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlaylist),
            });
            if (!response.ok) {
                throw new Error('Create failed');
            }
            await fetchPlaylists();
            handleDialogClose();
        } catch (error) {
            console.error('Create error:', error);
        }
    };

    const sortPlaylists = (playlists: Playlist[], option: string): Playlist[] => {
        return [...playlists].sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            switch (option) {
                case 'dateAsc':
                    return dateTimeA.getTime() - dateTimeB.getTime();
                case 'dateDesc':
                    return dateTimeB.getTime() - dateTimeA.getTime();
                case 'contentAsc':
                    return a.content.localeCompare(b.content);
                case 'contentDesc':
                    return b.content.localeCompare(a.content);
                default:
                    return 0;
            }
        });
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Video Feed
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="sort-select-label">Sort by</InputLabel>
                    <Select
                        labelId="sort-select-label"
                        value={sortOption}
                        label="Sort by"
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <MenuItem value="dateDesc">Newest First</MenuItem>
                        <MenuItem value="dateAsc">Oldest First</MenuItem>
                        <MenuItem value="contentAsc">Content (A-Z)</MenuItem>
                        <MenuItem value="contentDesc">Content (Z-A)</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                >
                    Add Playlist
                </Button>
            </Box>
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
                                {playlist.date} at {playlist.time}
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
                            label="Sauce (Video URL)"
                            type="text"
                            fullWidth
                            value={formData.sauce || ''}
                            onChange={(e) => setFormData({ ...formData, sauce: e.target.value })}
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