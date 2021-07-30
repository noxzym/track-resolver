const { getData, getTracks } = require('spotify-url-info');
const { Client } = require('youtubei');
const youtube = new Client();
const spotifyRegex = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
function songResultToTrack(i) {
  return {
    identifier: i.id,
    isSeekable: true,
    author: i.artists.map((x) => x.name).join(', '),
    length: i.duration_ms,
    isStream: false,
    position: 0,
    title: i.name,
    uri: `https://open.spotify.com/track/${i.id}`,
    sourceName: 'spotify',
  };
}

function resolverToTrack(i) {
  return { identifier: i.id, title: i.title, author: i.channel.name, length: Math.round(i.duration * 1000), isStream: i.isLive ?? i.isLiveContent, isSeekable: i.isLive ? false : !i.isLiveContent, position: 0, uri: `https://youtube.com/watch?v=${i.id}`, sourceName: 'youtube' };
}
module.exports = async function spotifySource(query, autoResolve = false) {
  const [, type] = spotifyRegex.exec(query);
  switch (type) {
    case 'album': {
      const tracks = await getTracks(query);
      const albumInfo = await getData(query);
      if(autoResolve) {
        const resolvingTracks = tracks.map(async x => youtube.findOne(`${x.name}- ${x.artists.map(x => x.name).join(" ")}`, { type: 'video' }));
        const resolvedTracks = await Promise.all(resolvingTracks);
        return { entries: resolvedTracks.map((x) => resolverToTrack(x)), plData: { name: albumInfo.name, selectedTrack: 1 } };
      }
      return { entries: tracks.map((x) => songResultToTrack(x)), plData: { name: albumInfo.name, selectedTrack: 1 } };
      break;
    }
    case 'playlist': {
      const tracks = await getTracks(query);
      const playlistInfo = await getData(query);
      if(autoResolve) {
        const resolvingTracks = tracks.map(async x => youtube.findOne(`${x.name}- ${x.artists.map(x => x.name).join(" ")}`, { type: 'video' }));
        const resolvedTracks = await Promise.all(resolvingTracks);
        return { entries: resolvedTracks.map((x) => resolverToTrack(x)), plData: { name: playlistInfo.name, selectedTrack: 1 } };
      }
      return { entries: tracks.map((x) => songResultToTrack(x)), plData: { name: playlistInfo.name, selectedTrack: 1 } };
      break;
    }
    case 'track': {
      const tracks = await getTracks(query);
      if(autoResolve) {
        const resolvingTracks = tracks.map(async x => youtube.findOne(`${x.name}- ${x.artists.map(x => x.name).join(" ")}`, { type: 'video' }));
        const resolvedTracks = await Promise.all(resolvingTracks);
        return { entries: resolvedTracks.map((x) => resolverToTrack(x)) };
      }
      return { entries: tracks.map((x) => songResultToTrack(x)) };
      break;
    }

    default:
      break;
  }
};
