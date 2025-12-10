package com.beyza.music_postit.song;

import java.time.LocalDateTime;

public class SongResponse {

    private Long id;
    private String externalId;
    private String title;
    private String artist;
    private String album;
    private String coverUrl;
    private Integer durationSec;
    private LocalDateTime createdAt;

    public SongResponse() {
    }

    public SongResponse(Long id, String externalId, String title, String artist,
                        String album, String coverUrl, Integer durationSec,
                        LocalDateTime createdAt) {
        this.id = id;
        this.externalId = externalId;
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.coverUrl = coverUrl;
        this.durationSec = durationSec;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
