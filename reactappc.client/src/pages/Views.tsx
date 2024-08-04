import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaylistDialog from '../components/Playlist/PlaylistDialog';
import PlaylistCard from '../components/Playlist/PlaylistCard';
import { getAppFromUrl, sortPlaylists } from '../services/utils';
import { fetchAllPlaylists, deletePlaylist, createPlaylist } from '../services/playlistService';

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
        const loadPlaylists = async () => {
            try {
                const data = await fetchAllPlaylists();
                setPlaylists(sortPlaylists(data, sortOption));
            } catch (error) {
                console.error('Fetching error:', error);
            }
        };

        loadPlaylists();
    }, [sortOption]);

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
            const data = await fetchAllPlaylists();
            setPlaylists(sortPlaylists(data, sortOption));
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const app = getAppFromUrl(formData.sauce || '');
            const newPlaylist = { ...formData, app };
            await createPlaylist(newPlaylist);
            const data = await fetchAllPlaylists();
            setPlaylists(sortPlaylists(data, sortOption));
            handleDialogClose();
        } catch (error) {
            console.error('Create error:', error);
        }
    };

    const handleFormDataChange = (field: keyof Playlist, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                    <PlaylistCard
                        key={playlist.id}
                        playlist={playlist}
                        onDelete={handleDelete}
                    />
                ))}
            </Stack>

            <PlaylistDialog
                open={dialogOpen}
                formData={formData}
                onClose={handleDialogClose}
                onChange={handleFormDataChange}
                onSubmit={handleSubmit}
            />
        </Box>
    );
};

export default Views;
