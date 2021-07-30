const baseSoundcloudURL = 'https://soundcloud.com';
const fakeAgent = `Mozilla/5.0 (Server; NodeJS ${process.version}; rv:1.0) Magma/1.0 (KHTML, like Gecko) TrackResolver/1.0`;
const baseHTTPRequestHeaders = {
  'User-Agent': fakeAgent,
  'Accept-Language': 'en-US,en;q=0.5',
  Connection: 'keep-alive',
};
module.exports = { baseSoundcloudURL, baseHTTPRequestHeaders };
