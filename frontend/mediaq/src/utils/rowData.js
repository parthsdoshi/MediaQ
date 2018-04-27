import * as keyUtils from 'firebase-key'

export function RowData(id, title, description, author, album, source, thumbnail, displayName) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.author = author;
    this.album = album;
    this.source = source;
    this.thumbnail = thumbnail;
    this.displayName = displayName;
    this.timestamp = keyUtils.key();
    this.link = "https://www.youtube.com/watch?v=" + this.id;
}

export function rowDataToString(rowData) {
    return 'id: ' + rowData.id + '\n' +
        'title: ' + rowData.title + '\n' +
        'author: ' + rowData.author + '\n' +
        'album: ' + rowData.album + '\n' +
        'source: ' + rowData.source + '\n' +
        'added by: ' + rowData.displayName + '\n' +
        'added on: ' + keyUtils.date(rowData.timestamp).toString() + '\n' +
        'link: ' + rowData.link + '\n' +
        'thumbnail: ' + rowData.thumbnail;
}

export function stringToRowData(string, displayName) {
    let split = string.split('\n');
    let result = {};
    const description = 'description not available for imported videos';
    for (let i = 0; i+9 < split.length; i += 10) {
        const id = split[i].substring(split[i].indexOf(': ') + 2);
        const title = split[i+1].substring(split[i+1].indexOf(': ') + 2);
        const author = split[i+2].substring(split[i+2].indexOf(': ') + 2);
        const album = split[i+3].substring(split[i+3].indexOf(': ') + 2);
        const source = split[i+4].substring(split[i+4].indexOf(': ') + 2);
        const thumbnail = split[i+8].substring(split[i+5].indexOf(': ') + 8);
        const rowData = new RowData(id, title, description, author, album, source, thumbnail, displayName);
        result[rowData.timestamp] = rowData;
    }
    return result;
}

export function generateRowDataFromYoutubeSearchResults(youtubeResults, displayName) {
    let results = {};
    for (let i = 0; i < youtubeResults.items.length; i++) {
        let rowData = getResultData(youtubeResults, i, displayName);
        results[rowData.timestamp] = rowData;
    }
    return results;
}

function getResultData(data, number, displayName) {
    return new RowData(
        data.items[number].id.videoId,
        data.items[number].snippet.title,
        data.items[number].snippet.description,
        data.items[number].snippet.channelTitle,
        ' - ',
        'YouTube',
        data.items[number].snippet.thumbnails.default.url,
        displayName)
}

export function generateRowDataFromPlaylistResults(playlistResults, displayName) {
    let results = {};
    for (let i = 0; i < playlistResults.length; i++) {
        const currentPageResults = playlistResults[i];
        for (let j = 0; j < currentPageResults.items.length; j++) {
            const rowData = getPlaylistResultData(currentPageResults, j, displayName);
            if (rowData === null) {
                // video unavailable
                continue;
            }
            results[rowData.timestamp] = rowData
        }
    }
    return results;
}

export function generateRowDataFromURL(url, displayName) {
    return new RowData(url, url, url, url, url, url, '', displayName);
}

function getPlaylistResultData (playlistData, number, displayName) {
    if (playlistData.items[number].snippet.thumbnails === undefined &&
            playlistData.items[number].snippet.title === 'Deleted video' &&
            playlistData.items[number].snippet.description === 'This video is unavailable.') {
        // deleted video
        return null;
    }
    if (playlistData.items[number].snippet.thumbnails === undefined &&
        playlistData.items[number].snippet.title === 'Private video' &&
        playlistData.items[number].snippet.description === 'This video is private.') {
        // private video
        return null;
    }


    let thumbnail = '';
    if (playlistData.items[number].snippet.thumbnails !== undefined) {
        thumbnail = playlistData.items[number].snippet.thumbnails.default.url;
    } else {
        console.log(playlistData.items[number]);
    }
    return new RowData(
        playlistData.items[number].snippet.resourceId.videoId,
        playlistData.items[number].snippet.title,
        playlistData.items[number].snippet.description,
        ' Playlist ',
        ' - ',
        'YouTube',
        thumbnail,
        displayName);
}