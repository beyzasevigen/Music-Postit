package com.beyza.music_postit.external;

public class ExternalSongDto {

    private String externalId;
    private String title;
    private String artist;
    private String album;
    private String coverUrl;
    private Integer durationSec;

    public ExternalSongDto() {
    }

    public ExternalSongDto(String externalId, String title, String artist,
                           String album, String coverUrl, Integer durationSec) {
        this.externalId = externalId;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.coverUrl = coverUrl;
        this.durationSec = durationSec;
    }

    public String getExternalId() {
        return externalId;
    }

    public String getTitle() {
        return title;
    }

    public String getArtist() {
        return artist;
    }

    public String getAlbum() {
        return album;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public Integer getDurationSec() {
        return durationSec;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public void setDurationSec(Integer durationSec) {
        this.durationSec = durationSec;
    }
}
