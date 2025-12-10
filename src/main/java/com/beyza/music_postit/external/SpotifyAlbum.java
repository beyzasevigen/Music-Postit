package com.beyza.music_postit.external;

import java.util.List;

public class SpotifyAlbum {

    private String name;
    private List<SpotifyImage> images;

    public SpotifyAlbum() {
    }

    public String getName() {
        return name;
    }

    public List<SpotifyImage> getImages() {
        return images;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setImages(List<SpotifyImage> images) {
        this.images = images;
    }
}
