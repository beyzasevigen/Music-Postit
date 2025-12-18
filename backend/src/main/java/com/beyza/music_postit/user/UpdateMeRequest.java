package com.beyza.music_postit.user;

public class UpdateMeRequest {
    private String username;
    private String imageUrl;

    public String getUsername() { return username; }
    public String getImageUrl() { return imageUrl; }
    public void setUsername(String username) { this.username = username; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}

