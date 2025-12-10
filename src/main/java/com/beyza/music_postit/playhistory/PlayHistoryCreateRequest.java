package com.beyza.music_postit.playhistory;

public class PlayHistoryCreateRequest {

    private Long songId;
    private Integer lastPositionSec;

    public PlayHistoryCreateRequest() {
    }

    public Long getSongId() {
        return songId;
    }

    public void setSongId(Long songId) {
        this.songId = songId;
    }

    public Integer getLastPositionSec() {
        return lastPositionSec;
    }

    public void setLastPositionSec(Integer lastPositionSec) {
        this.lastPositionSec = lastPositionSec;
    }
}
