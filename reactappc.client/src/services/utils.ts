// utils.ts
export const getAppFromUrl = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return 'YouTube';
    } else if (url.includes('vimeo.com')) {
        return 'Vimeo';
    } else if (url.includes('dailymotion.com')) {
        return 'Dailymotion';
    } else if (url.includes('twitch.tv')) {
        return 'Twitch';
    } else if (url.includes('instagram.com')) {
        return 'Instagram';
    } else {
        return 'Unknown';
    }
};

export const sortPlaylists = (playlists: Playlist[], option: string): Playlist[] => {
    return [...playlists].sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        switch (option) {
            case 'dateAsc':
                return dateTimeA.getTime() - dateTimeB.getTime();
            case 'dateDesc':
                return dateTimeB.getTime() - dateTimeA.getTime();
            case 'contentAsc':
                return a.content.localeCompare(b.content);
            case 'contentDesc':
                return b.content.localeCompare(a.content);
            default:
                return 0;
        }
    });
};
