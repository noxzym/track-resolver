const YoutubeSource = require("./sources/youtube")
const SoundCloudSource = require("./sources/soundcloud");
const spotifySource = require("./sources/spotify");
const HTTPSource = require("./sources/http");
const IDRegex = /(ytsearch:)?(scsearch:)?(.+)/;
const { baseSoundcloudURL } = require('./Constants');
const soundCloudURL = new URL(baseSoundcloudURL);
const Util = require("./util/Util");
module.exports = class trackResolver {
    /**
     * @param {import('./typings/index').trackOptions} options 
     */
    constructor(options) {
        this.options = options ?? {}
    }
    //some code copied from volcano: https://github.com/AmandaDiscord/Volcano
    /**
     * 
     * @param {string} query 
     * @returns Promise<import('./typings/index').trackResult>
     */
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
            const data = await SoundCloudSource(resource, isSoundcloudSearch)
            if (data?.entries.length === 0 || !data) return Object.assign({ loadType: "NO_MATCHES"}, payload)
            if(data.plData) {
                playlist = true;
                payload.playlistInfo = data.plData;
            }
            payload.tracks = data.entries;
            
        } else if(url && url.hostname.includes("spotify")) {
            const data = await spotifySource(query).catch(e => Util.standardErrorHandler(e, payload));
            if (!data.entries || data?.entries.length === 0 || !data) return Object.assign({ loadType: "NO_MATCHES"}, payload)
            
            if(data.plData) {
                payload.playlistInfo = data.plData
                playlist = true
            }
            payload.tracks = data.entries
        } else if (url && !url.hostname.includes("youtu")) {
            const data = await HTTPSource(resource).catch(e => Util.standardErrorHandler(e, payload));
            if (!data) return Object.assign({ loadType: "NO_MATCHES"}, payload)
            
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
            payload.tracks.push(info);
        } else if(isYouTubeSearch || (url && url.hostname.includes("youtu") || !isYouTubeSearch && !isSoundcloudSearch )) {
            const data = await YoutubeSource(resource || query, { isSearch: isYouTubeSearch || url && url.hostname.includes("youtu") ? false : true || (!isYouTubeSearch && !isSoundcloudSearch) ? true : false, loadAllTrack: this.options?.loadFullPlaylist }).catch(e => Util.standardErrorHandler(e, payload));;
            if (!data.entries || data?.entries.length === 0 || !data) return Object.assign({ loadType: "NO_MATCHES"}, payload)
            const infos = data.entries.map(i => ({ identifier: i.id, title: i.title, author: i.channel.name, length: Math.round(i.duration * 1000), isStream: i.isLive ?? i.isLiveContent, isSeekable: i.isLive ? false : i.isLiveContent ? false : true, position: 0, uri: `https://youtube.com/watch?v=${i.id}`, sourceName: "youtube" }));
            if (data.plData) {
                payload.playlistInfo = data.plData;
                playlist = true;
            }
            payload.tracks = infos;
        }
        return Object.assign({ loadType: payload.tracks.length > 1 && (isYouTubeSearch || isSoundcloudSearch || !isYouTubeSearch && !isSoundcloudSearch && !playlist) ? "SEARCH_RESULT" : playlist ? "PLAYLIST_LOADED" : "TRACK_LOADED"  }, payload)
	}
}
