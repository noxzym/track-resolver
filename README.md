# track-resolver
A easy to use track-resolver for discord music bot, highly inpired from lavaplayer searching track


# Installation
 ### Stable version
 - npm install track-resolver
 ### Dev version
 - npm install NezuChan/track-resolver

## Usage
```js
const trackResolver = require('./src');
const TrackResolver = new trackResolver()
const search = async (query) => {
    const tracks = await TrackResolver.load(query)
    console.log(tracks)
}
search("rick astley never gonna give you up")
/* soundcloud search: search("scsearch:rick astley never gonna give you up") */
```
## result: 
```js
{
  loadType: 'SEARCH_RESULT',
  playlistInfo: {},
  tracks: SearchResult(19) [
    {
      identifier: 'dQw4w9WgXcQ',
      author: 'Rick Astley',
      title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
      length: 213000,
      isStream: false,
      isSeekable: true,
      position: 0,
      uri: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      sourceName: 'youtube'
    },
   ...
  ]
}
```

## Feature
- Spotify support
- Soundcloud support
- Youtube support
- Http support
- and many more if you do a pr :)
- easy to read if track is playlist, search or single result
