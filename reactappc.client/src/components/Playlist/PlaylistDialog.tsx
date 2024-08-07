// src/components/PlaylistDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
} from '@mui/material';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    date: string;
    time: string;
}

interface PlaylistDialogProps {
    open: boolean;
    formData: Partial<Playlist>;
    onClose: () => void;
    onChange: (field: keyof Playlist, value: string) => void;
    onSubmit: (event: React.FormEvent) => void;
}

const PlaylistDialog: React.FC<PlaylistDialogProps> = ({ open, formData, onClose, onChange, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Create Playlist</DialogTitle>
            <form onSubmit={onSubmit}>
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
                        onChange={(e) => onChange('content', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Sauce (Video URL)"
                        type="text"
                        fullWidth
                        value={formData.sauce || ''}
                        onChange={(e) => onChange('sauce', e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default PlaylistDialog;
