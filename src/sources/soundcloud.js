const { Client } = require('soundcloud-scraper');
const soundcloud = new Client();
//some code copied from volcano: https://github.com/AmandaDiscord/Volcano
const playlistRegex = /\/sets\//;
function songResultToTrack(i) {
	if (!i.streams.hls && !i.streams.progressive) throw new Error("NO_SOUNDCLOUD_SONG_STREAM_URL");
	return {
		identifier: i.streams.hls ? `O:${i.streams.hls}` : i.streams.progressive,
		isSeekable: true,
		author: i.author.username,
		length: i.duration,
		isStream: false,
		position: 0,
		title: i.title,
		uri: i.url,
        sourceName: 'soundcloud'
	};
}

module.exports = async function soundcloudSource(query, isSearch) {
    if (isSearch) {
		const results = await soundcloud.search(query, "track");
		const trackData = await Promise.all(results.map(i => soundcloud.getSongInfo(i.url, { fetchStreamURL: true })));
		return { entries: trackData.map(songResultToTrack) };
	}

    const url = new URL(query);

    if (url.pathname.split("/").length === 2) {
		const user = await soundcloud.getUser(url.pathname.split("/")[1]);
		const songs = await Promise.all(user.tracks.map(i => soundcloud.getSongInfo(i.url, { fetchStreamURL: true })));
		return { entries: songs.map(songResultToTrack) } ;
	}

    if (query.match(playlistRegex)) {
		const playlist = await soundcloud.getPlaylist(query);
		return { entries: playlist.tracks.map(songResultToTrack), plData: { name: playlist.title, selectedTrack: 1 } };
	}
	const data = await soundcloud.getSongInfo(query, { fetchStreamURL: true });
	return { entries: [songResultToTrack(data)] };
} 