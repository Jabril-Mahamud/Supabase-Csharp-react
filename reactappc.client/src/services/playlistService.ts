export const fetchUserId = async (token: string) => {
    const response = await fetch('https://localhost:7294/api/Auth/user', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error('Error fetching user ID');
    }
    return response.json();
};

export const updatePlaylist = async (id: number, completed: boolean) => {
    const response = await fetch(`/api/playlist/${id}/complete`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to mark playlist as complete');
    }
};



export const fetchAllPlaylists = async () => {
    const response = await fetch('https://localhost:7294/api/Playlist');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const fetchIdPlaylists = async (userId: string) => {
    const response = await fetch(`https://localhost:7294/api/Playlist/user/${userId}`);
    if (!response.ok) {
        throw new Error('Error fetching playlists');
    }
    return response.json();
};

export const deletePlaylist = async (id: number) => {
    const response = await fetch(`https://localhost:7294/api/Playlist/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Delete failed');
    }
};

export const createPlaylist = async (playlistData: any) => {
    const response = await fetch('https://localhost:7294/api/Playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playlistData),
    });
    if (!response.ok) {
        throw new Error('Create failed');
    }
};
