const YoutubeSource = require("./sources/youtube")
const IDRegex = /(ytsearch:)?(.+)/;
module.exports = class trackResolver {
    //some code copied from volcano: https://github.com/AmandaDiscord/Volcano
	async load(query) {
		const payload = {
			playlistInfo: {},
			tracks: []
		};
		let playlist = false;
		const match = query.match(IDRegex);
		const isYouTubeSearch = !!match[1];
		const resource = match[3];
		let url;
		if (query.startsWith("http")) url = new URL(query);
		if(isYouTubeSearch || (url && url.hostname.includes("youtube"))) {
			const data = await YoutubeSource(resource || query, isYouTubeSearch);
		
			if (!data.entries) return;
			const infos = data.entries.map(i => ({ identifier: i.id, author: i.channel.name, length: Math.round(i.duration * 1000), isStream: i.isLive || i.isLiveContent, isSeekable: i.duration !== 0, position: 0, uri: `https://youtube.com/watch?v=${i.id}`, sourceName: "youtube" }));
		  if (data.plData) {
		  	payload.playlistInfo = data.plData;
		  	playlist = true;
		  }
		  payload.tracks = infos;
		}
		return Object.assign({ loadType: payload.tracks.length > 1 && isYouTubeSearch ? "SEARCH_RESULT" : playlist ? "PLAYLIST_LOADED" : "TRACK_LOADED" }, payload )
	}
}