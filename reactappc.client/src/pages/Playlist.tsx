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
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

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

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'content', headerName: 'Content', width: 150 },
        { field: 'sauce', headerName: 'Sauce', width: 150 },
        { field: 'app', headerName: 'App', width: 150 },
        {
            field: 'dateTime',
            headerName: 'DateTime',
            width: 200,
            valueFormatter: (params) => {
                const date = new Date(params.value as string);
                return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <IconButton
                    color="secondary"
                    onClick={() => handleDelete(params.id as number)}
                >
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
        dateTime: playlist.dateTime,
    }));

    const options = ['Create'];

    return (
        <div>
            <h1>Playlists</h1>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
            </div>
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
