package com.beyza.music_postit.notification;

import java.time.LocalDateTime;

public class LikeNotificationResponse {
    private Long id;
    private Long noteId;
    private Long songId;
    private String songTitle;
    private String likedByUsername;
    private String likedByImageUrl;
    private LocalDateTime createdAt;

    // ✅ yeni alan
    private String message;

    public LikeNotificationResponse() {}

    public LikeNotificationResponse(Long id, Long noteId, Long songId, String songTitle,
                                    String likedByUsername, String likedByImageUrl,
                                    LocalDateTime createdAt, String message) {
        this.id = id;
        this.noteId = noteId;
        this.songId = songId;
        this.songTitle = songTitle;
        this.likedByUsername = likedByUsername;
        this.likedByImageUrl = likedByImageUrl;
        this.createdAt = createdAt;
        this.message = message;
    }

    public Long getId() { return id; }
    public Long getNoteId() { return noteId; }
    public Long getSongId() { return songId; }
    public String getSongTitle() { return songTitle; }
    public String getLikedByUsername() { return likedByUsername; }
    public String getLikedByImageUrl() { return likedByImageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public String getMessage() { return message; }

    public void setId(Long id) { this.id = id; }
    public void setNoteId(Long noteId) { this.noteId = noteId; }
    public void setSongId(Long songId) { this.songId = songId; }
    public void setSongTitle(String songTitle) { this.songTitle = songTitle; }
    public void setLikedByUsername(String likedByUsername) { this.likedByUsername = likedByUsername; }
    public void setLikedByImageUrl(String likedByImageUrl) { this.likedByImageUrl = likedByImageUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void setMessage(String message) { this.message = message; }
}
