package com.beyza.music_postit.playhistory;

import java.time.LocalDateTime;

public class PlayHistoryResponse {

    private Long id;
    private Long songId;
    private String songTitle;
    private String songArtist;
    private LocalDateTime playedAt;
    private Integer lastPositionSec;

    public PlayHistoryResponse() {
    }

    public PlayHistoryResponse(Long id, Long songId, String songTitle, String songArtist,
                               LocalDateTime playedAt, Integer lastPositionSec) {
        this.id = id;
        this.songId = songId;
        this.songTitle = songTitle;
        this.songArtist = songArtist;
        this.playedAt = playedAt;
        this.lastPositionSec = lastPositionSec;
    }

    public Long getId() {
        return id;
    }

    public Long getSongId() {
        return songId;
    }

    public String getSongTitle() {
        return songTitle;
    }

    public String getSongArtist() {
        return songArtist;
    }

    public LocalDateTime getPlayedAt() {
        return playedAt;
    }

    public Integer getLastPositionSec() {
        return lastPositionSec;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSongId(Long songId) {
        this.songId = songId;
    }

    public void setSongTitle(String songTitle) {
        this.songTitle = songTitle;
    }

    public void setSongArtist(String songArtist) {
        this.songArtist = songArtist;
    }

    public void setPlayedAt(LocalDateTime playedAt) {
        this.playedAt = playedAt;
    }

    public void setLastPositionSec(Integer lastPositionSec) {
        this.lastPositionSec = lastPositionSec;
    }
}
