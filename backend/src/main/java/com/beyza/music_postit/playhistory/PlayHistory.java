package com.beyza.music_postit.playhistory;

import com.beyza.music_postit.user.User;
import com.beyza.music_postit.song.Song;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "play_history")
public class PlayHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "song_id")
    private Song song;

    // Dinleme başladığı an
    @Column(name = "played_at", nullable = false)
    private LocalDateTime playedAt = LocalDateTime.now();

    // İstersek son dinlediği pozisyon (saniye)
    @Column(name = "last_position_sec")
    private Integer lastPositionSec;

    public PlayHistory() {}

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

    public LocalDateTime getPlayedAt() {
        return playedAt;
    }

    public void setPlayedAt(LocalDateTime playedAt) {
        this.playedAt = playedAt;
    }

    public Integer getLastPositionSec() {
        return lastPositionSec;
    }

    public void setLastPositionSec(Integer lastPositionSec) {
        this.lastPositionSec = lastPositionSec;
    }
}
