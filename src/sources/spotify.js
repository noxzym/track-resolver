const { getData, getTracks } = require('spotify-url-info');

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

module.exports = async function spotifySource(query) {
  const [, type] = spotifyRegex.exec(query);
  switch (type) {
    case 'album': {
      const tracks = await getTracks(query);
      const albumInfo = await getData(query);
      return { entries: tracks.map((x) => songResultToTrack(x)), plData: { name: albumInfo.name, selectedTrack: 1 } };
      break;
    }
    case 'playlist': {
      const tracks = await getTracks(query);
      const playlistInfo = await getData(query);
      return { entries: tracks.map((x) => songResultToTrack(x)), plData: { name: playlistInfo.name, selectedTrack: 1 } };
      break;
    }
    case 'track': {
      const tracks = await getTracks(query);
      return { entries: tracks.map((x) => songResultToTrack(x)) };
      break;
    }

    default:
      break;
  }
};
