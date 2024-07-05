import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    IconButton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    dateTime: string;
}

const Playlist: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

    const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFormData({});
    };

    const handleCreate = () => {
        setFormData({});
        setDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        fetch(`https://localhost:7294/api/Playlist/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Delete failed');
                }
                fetchPlaylists();
            })
            .catch(error => console.error('Delete error:', error));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const currentDateTime = new Date().toISOString();

        fetch('https://localhost:7294/api/Playlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, dateTime: currentDateTime }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Create failed');
                }
                fetchPlaylists();
                handleDialogClose();
            })
            .catch(error => console.error('Create error:', error));
    };

    const options = ['Create'];

    return (
        <div>
            <h1>Playlists</h1>
            {playlists.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Content</th>
                            <th>Sauce</th>
                            <th>App</th>
                            <th>DateTime</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playlists.map(playlist => (
                            <tr key={playlist.id}>
                                <td>{playlist.id}</td>
                                <td>{playlist.content}</td>
                                <td>{playlist.sauce}</td>
                                <td>{playlist.app}</td>
                                <td>{new Date(playlist.dateTime).toLocaleString()}</td>
                                <td>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDelete(playlist.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <ButtonGroup variant="contained" aria-label="split button">
                <Button onClick={handleCreate}>Create</Button>
                <Button
                    size="small"
                    aria-controls={anchorEl ? 'split-button-menu' : undefined}
                    aria-expanded={anchorEl ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Menu
                id="split-button-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === 0}
                        onClick={handleCreate}
                    >
                        {option}
                    </MenuItem>
                ))}
            </Menu>

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

export default Playlist;
