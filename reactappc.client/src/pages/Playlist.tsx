import React, { useEffect, useState } from 'react';

interface Playlist {
    id: number;
    content: string;
    sauce: string;
    app: string;
    dateTime: string; // use string for dateTime to handle JSON dates
}

const Playlist: React.FC = () => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

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
            console.log('Fetched data:', data);  // Log the fetched data
            setPlaylists(data);
        } catch (error) {
            console.error('Fetching error:', error);
        }
    };

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
                        </tr>
                    </thead>
                    <tbody>
                        {playlists.map(playlist => (
                            <tr key={playlist.id}>
                                <td>{playlist.id}</td>
                                <td>{playlist.content}</td>
                                <td>{playlist.sauce}</td>
                                <td>{playlist.app}</td>
                                <td>{new Date(playlist.dateTime).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Playlist;
