package com.beyza.music_postit.note;

import java.time.LocalDateTime;

public class NoteResponse {

    private Long id;
    private Long userId;
    private String username;
    private Long songId;
    private Integer timestampSec;
    private String text;
    private LocalDateTime createdAt;

    public NoteResponse() {
    }

    public NoteResponse(Long id, Long userId, String username,
                        Long songId, Integer timestampSec,
                        String text, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.songId = songId;
        this.timestampSec = timestampSec;
        this.text = text;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public Long getSongId() {
        return songId;
    }

    public Integer getTimestampSec() {
        return timestampSec;
    }

    public String getText() {
        return text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setSongId(Long songId) {
        this.songId = songId;
    }

    public void setTimestampSec(Integer timestampSec) {
        this.timestampSec = timestampSec;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
