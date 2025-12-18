package com.beyza.music_postit.user;

public class MeResponse {
    private Long id;
    private String username;
    private String email;
    private String imageUrl;

    public MeResponse(Long id, String username, String email, String imageUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getImageUrl() { return imageUrl; }
}
