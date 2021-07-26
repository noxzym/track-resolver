const YoutubeSource = require("./sources/youtube")
const SoundCloudSource = require("./sources/soundcloud");
const spotifySource = require("./sources/spotify");
const HTTPSource = require("./sources/http");
const IDRegex = /(ytsearch:)?(scsearch:)?(.+)/;
const { baseSoundcloudURL } = require('./Constants');
const soundCloudURL = new URL(baseSoundcloudURL);
module.exports = class trackResolver {
    constructor(options) {
        this.options = options
    }
    //some code copied from volcano: https://github.com/AmandaDiscord/Volcano
	async load(query) {
		const payload = {
			playlistInfo: {},
			tracks: []
		};
		let playlist = false;
		const match = query.match(IDRegex);
		const isYouTubeSearch = !!match[1];
        const isSoundcloudSearch = !!match[2];
		const resource = match[3];
		let url;
		if (query.startsWith("http")) url = new URL(query);
        if(isSoundcloudSearch || (url && url.hostname === soundCloudURL.hostname)) {
            const data = await SoundCloudSource(resource, isSoundcloudSearch);
            if (!data) return;
            if(data.plData) {
                playlist = true;
                payload.playlistInfo = data.plData;
            }
            payload.tracks = data.entries;
            
        } else if(url && url.hostname.includes("spotify")) {
            const data = await spotifySource(query);
            if(data.plData) {
                payload.playlistInfo = data.plData
                playlist = true
            }
            payload.tracks = data.entries
        } else if (url && !url.hostname.includes("youtu") || !url.hostname.includes("spotify")) {
            const data = await HTTPSource(resource)
            const info = {
                identifier: resource,
                author: data.extra.author || data.parsed.common.artist || "Unknown artist",
                length: Math.round((data.parsed.format.duration || 0) * 1000),
                isStream: data.extra.stream,
                position: 0,
                title: data.extra.title || data.parsed.common.title || "Unknown title",
                uri: resource,
                sourceName: 'http'
            };

            if (!data) return;
            payload.tracks.push(info);
        } else if(isYouTubeSearch || (url && url.hostname.includes("youtube") || !isYouTubeSearch && !isSoundcloudSearch )) {
            const data = await YoutubeSource(resource || query, { isSearch: isYouTubeSearch || (!isYouTubeSearch && !isSoundcloudSearch) ? true : false, loadAllTrack: this.options?.loadFullPlaylist });
			if (!data.entries) return;
			const infos = data.entries.map(i => ({ identifier: i.id, author: i.channel.name, length: Math.round(i.duration * 1000), isStream: i.isLive ?? i.isLiveContent, isSeekable: i.isLive ? false : i.isLiveContent ? false : true, position: 0, uri: `https://youtube.com/watch?v=${i.id}`, sourceName: "youtube" }));
            if (data.plData) {
                payload.playlistInfo = data.plData;
                playlist = true;
            }
            payload.tracks = infos;
        }
        if(payload.tracks.length === 0) return Object.assign({ loadType: "NO_MATCHES"}, payload)
		return Object.assign({ loadType: payload.tracks.length > 1 && isYouTubeSearch || (payload.tracks.length > 1 && (!isYouTubeSearch && !isSoundcloudSearch) && !playlist) ? "SEARCH_RESULT" : playlist ? "PLAYLIST_LOADED" : "TRACK_LOADED"  }, payload)
	}
}
