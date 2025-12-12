package com.beyza.music_postit.external;

import java.util.List;

public class SpotifyTrack {

    private String id;
    private String name;
    private List<SpotifyArtist> artists;
    private SpotifyAlbum album;
    private Integer duration_ms;

    public SpotifyTrack() {
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public List<SpotifyArtist> getArtists() {
        return artists;
    }

    public SpotifyAlbum getAlbum() {
        return album;
    }

    public Integer getDuration_ms() {
        return duration_ms;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setArtists(List<SpotifyArtist> artists) {
        this.artists = artists;
    }

    public void setAlbum(SpotifyAlbum album) {
        this.album = album;
    }

    public void setDuration_ms(Integer duration_ms) {
        this.duration_ms = duration_ms;
    }
}
