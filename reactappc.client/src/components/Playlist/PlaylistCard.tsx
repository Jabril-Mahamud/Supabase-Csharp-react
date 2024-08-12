import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Box, Avatar, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, MoreVert as MoreVertIcon, Check as CheckIcon } from '@mui/icons-material'; // Import DeleteIcon
import ReactPlayer from 'react-player';
import axios from 'axios';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    completed: string;
    app: string;
    date: string;
    time: string;
}

interface PlaylistCardProps {
    playlist: Playlist;
    onDelete: (id: number) => void;
    onComplete: (id: number) => void;
    aspectRatio?: number;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDelete, onComplete, aspectRatio = 4 / 3 }) => {
    const paddingTop = `${(1 / aspectRatio) * 100}%`;

    const handleComplete = async () => {
        try {
            await axios.patch(`/api/playlist/${playlist.id}/complete`);
            onComplete(playlist.id);
        } catch (error) {
            console.error('Error marking playlist as complete:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/playlist/${playlist.id}`);
            onDelete(playlist.id);
            // Optionally refresh the page or update the state here
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    };

    return (
        <Card sx={{
            boxShadow: 1,
            width: '100%',
            height: '60%',
            paddingTop: paddingTop,
            position: 'relative',
            overflow: 'hidden',
        }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <CardContent sx={{ flexShrink: 0, paddingBottom: 0 }}>
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
                <CardMedia sx={{ flex: 1, minHeight: 0 }}>
                    <ReactPlayer
                        url={playlist.sauce}
                        width="100%"
                        height="100%"
                        controls
                    />
                </CardMedia>
                <CardContent sx={{ flexShrink: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="body2" component="p" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                                {playlist.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" component="p">
                                {playlist.date} at {playlist.time}
                            </Typography>
                        </Box>
                        <Box>
                            {playlist.completed === 'false' && (
                                <Tooltip title="Mark as Complete">
                                    <IconButton
                                        size="small"
                                        onClick={handleComplete}
                                        color="success"
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Tooltip title="Delete">
                                <IconButton size="small" onClick={handleDelete} color="error">
                                    <DeleteIcon /> {/* Use DeleteIcon for deletion */}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
};

export default PlaylistCard;
