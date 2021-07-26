# track-resolver
A easy to use track-resolver for discord music bot, highly inpired from lavaplayer searching track


# Installation
 ### Stable version
 - npm install track-resolver
 ### Dev version
 - npm install NezuChan/track-resolver

## Usage
```js
const trackResolver = require('track-resolver');
const TrackResolver = new trackResolver()
(async() => {
    const tracks = await TrackResolver.load('rick astley never gonna give you up')
    console.log(tracks)
}()
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
