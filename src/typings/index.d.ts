declare module 'track-resolver' {
    export interface trackOptions {
        loadFullPlaylist?: boolean,
        resolveSpotify?: boolean,
    }

    export interface trackResult {
        loadType: loadType,
        exception?: {
            message: string;
            severity: string;
          };
        playlistInfo: {
            name: string,
            selectedTrack: number,
        }
        tracks: tracks[]
    }

    export interface tracks {
        identifier: string,
        isSeekable: boolean,
        author: string,
        length: number,
        isStream: boolean,
        position: number,
        title: string,
        uri: string,
        sourceName: string
    }
    
    export type LoadType =
    | "TRACK_LOADED"
    | "PLAYLIST_LOADED"
    | "SEARCH_RESULT"
    | "LOAD_FAILED"
    | "NO_MATCHES";
}