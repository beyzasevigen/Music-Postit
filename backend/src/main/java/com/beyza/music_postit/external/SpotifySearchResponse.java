package com.beyza.music_postit.external;

public class SpotifySearchResponse {

    private SpotifyTracksPage tracks;

    public SpotifySearchResponse() {
    }

    public SpotifyTracksPage getTracks() {
        return tracks;
    }

    public void setTracks(SpotifyTracksPage tracks) {
        this.tracks = tracks;
    }
}
