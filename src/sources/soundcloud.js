const SoundCloud = require('soundcloud.ts').default;

const soundcloud = new SoundCloud();
// some code copied from volcano: https://github.com/AmandaDiscord/Volcano
const playlistRegex = /\/sets\//;
function songResultToTrack(i) {
  if (!i || !i.media?.transcodings.length) return;
  return {
    identifier: i.media.transcodings[0].url,
    isSeekable: true,
    author: i.user.username,
    length: i.duration,
    isStream: false,
    position: 0,
    title: i.title,
    uri: i.permalink_url,
    sourceName: 'soundcloud',
  };
}

module.exports = async function soundcloudSource(query, isSearch) {
  if (isSearch) {
    const results = await soundcloud.tracks.searchV2({ q: query });
    return { entries: results.collection.map((x) => songResultToTrack(x)) };
  }

  if (query.match(playlistRegex)) {
    const playlist = await soundcloud.playlists.getV2(query);
    /* eslint no-console: "off" */
    /* eslint no-return-await: "off" */
    const tracks = playlist.tracks.map(async (x) => await soundcloud.tracks.getV2(x.id).catch((e) => console.log(e.message, `soundcloud trackId: ${x.id}`)));
    const resolvedTracks = await Promise.all(tracks);
    return { entries: resolvedTracks.map((x) => songResultToTrack(x)), plData: { name: playlist.title, selectedTrack: 1 } };
  }

  const data = await soundcloud.tracks.getV2(query);
  return { entries: [songResultToTrack(data)] };
};
