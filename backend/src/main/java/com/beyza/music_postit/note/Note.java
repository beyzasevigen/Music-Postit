package com.beyza.music_postit.note;

import com.beyza.music_postit.user.User;
import com.beyza.music_postit.song.Song;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Notu yazan kullanıcı
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    // Hangi şarkı için
    @ManyToOne(optional = false)
    @JoinColumn(name = "song_id")
    private Song song;

    // Şarkıdaki zaman (saniye cinsinden)
    @Column(name = "timestamp_sec", nullable = false)
    private Integer timestampSec;

    // Kullanıcının yazdığı not
    @Column(nullable = false, length = 500)
    private String text;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic = true;

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean aPublic) { isPublic = aPublic; }

    private LocalDateTime createdAt = LocalDateTime.now();

    public Note() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public Integer getTimestampSec() {
        return timestampSec;
    }

    public void setTimestampSec(Integer timestampSec) {
        this.timestampSec = timestampSec;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
