import React from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    completed: string;
    app: string;
    date: string;
    time: string;
}

interface PlaylistTableProps {
    playlists: Playlist[];
    handleDelete: (id: number) => void;
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ playlists, handleDelete }) => {
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'content', headerName: 'Content', width: 200 },
        { field: 'sauce', headerName: 'Sauce', flex: 1 },
        { field: 'completed', headerName: 'Complete', width: 120 },
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
        completed: playlist.completed,
        app: playlist.app,
        date: new Date(playlist.date).toLocaleDateString('en-US'),
        time: new Date(`1970-01-01T${playlist.time}`).toLocaleTimeString('en-US', { hour12: false }),
    }));

    return (
        <div style={{ flexGrow: 1, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={10} autoHeight />
        </div>
    );
};

export default PlaylistTable;
