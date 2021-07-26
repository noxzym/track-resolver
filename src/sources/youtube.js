const { Client } = require("youtubei");
const youtube = new Client();
module.exports = async function youtubeSource(query, { isSearch, loadAllTrack }) {
    //some code copied from volcano: https://github.com/AmandaDiscord/Volcano
	if(isSearch) {
		const videos = await youtube.search(query, { type: "video" });
		return { entries: videos }
	}
	let url;
	if (query.startsWith("http")) url = new URL(query);
	if (url && url.searchParams.get("list") && url.searchParams.get("list").startsWith("FL_") || query.startsWith("FL_")) throw new Error("Favorite list playlists cannot be fetched.");
	if (url && url.searchParams.has("list") || query.startsWith("PL")) {
		const data = await youtube.getPlaylist(query);
		if(loadAllTrack) await data.next(0)
		return { entries: data.videos, plData: { name: data.title, selectedTrack: url.searchParams.get("index") ? Number(url.searchParams.get("index")) : 1 } };
	}
	const data = await youtube.getVideo(query);
	return { entries: [data] }
}