export function RowData(id, title, author, album, source, thumbnail, displayName) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.album = album;
    this.source = source;
    this.thumbnail = thumbnail;
    this.displayName = displayName;
}

export function generateRowDataFromYoutubeSearchResults(youtubeResults, displayName) {
    let results = [];
    for (let i = 0; i < youtubeResults.items.length; i++) {
        results.push(getResultData(youtubeResults, i, displayName));
    }
    return results;
}

function getResultData(data, number, displayName) {
    return new RowData(
        data.items[number].id.videoId,
        data.items[number].snippet.title,
        data.items[number].snippet.channelTitle,
        ' - ',
        'YouTube',
        data.items[number].snippet.thumbnails.default.url,
        displayName);
}

export function generateRowDataFromPlaylistResults(playlistResults, displayName) {

}

function getPlaylistResultData (playlistData, number, displayName) {
    let thumbnail = '';
    if (playlistData.items[number].snippet.thumbnails !== undefined) {
        thumbnail = playlistData.items[number].snippet.thumbnails.default.url
    }
    return new RowData(
        playlistData.items[number].snippet.resourceId.videoId,
        playlistData.items[number].snippet.title,
        ' Playlist ',
        ' - ',
        'YouTube',
        thumbnail,
        displayName);
}