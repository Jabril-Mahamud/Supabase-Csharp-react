import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Box, Avatar } from '@mui/material';
import { Delete as DeleteIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import ReactPlayer from 'react-player';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    date: string;
    time: string;
}

interface PlaylistCardProps {
    playlist: Playlist;
    onDelete: (id: number) => void;
    aspectRatio?: number;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDelete, aspectRatio = 4 / 3 }) => {
    const cardHeight = '25%'; // Adjust this value as needed
    const paddingTop = `${(1 / aspectRatio) * 100}%`;

    return (
        <Card sx={{
            boxShadow: 1,
            width: '100%',
            height: '60%',
            maxHeight: cardHeight, // Set the max height for the card
            paddingTop: paddingTop,
            position: 'relative',
            overflow: 'hidden', // Prevent content overflow
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
                        <IconButton size="small" onClick={() => onDelete(playlist.id)} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
};

export default PlaylistCard;
