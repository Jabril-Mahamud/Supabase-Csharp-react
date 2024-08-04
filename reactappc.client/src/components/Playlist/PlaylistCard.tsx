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
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDelete }) => {
    return (
        <Card sx={{ boxShadow: 1 }}>
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
                    <IconButton size="small" onClick={() => onDelete(playlist.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PlaylistCard;
