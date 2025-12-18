package com.beyza.music_postit.notification;

import com.beyza.music_postit.note.Note;
import com.beyza.music_postit.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "like_notifications",
        indexes = {
                @Index(name = "idx_like_notif_owner_created", columnList = "owner_id, created_at")
        }
)
public class LikeNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Bildirimi alan kişi (not sahibi)
    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id")
    private User owner;

    // Like atan kişi
    @ManyToOne(optional = false)
    @JoinColumn(name = "liked_by_id")
    private User likedBy;

    // Hangi not like'landı
    @ManyToOne(optional = false)
    @JoinColumn(name = "note_id")
    private Note note;

    @Column(nullable = false)
    private String message; //

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public LikeNotification() {}

    public LikeNotification(User owner, User likedBy, Note note) {
        this.owner = owner;
        this.likedBy = likedBy;
        this.note = note;
        this.createdAt = LocalDateTime.now();
        this.message = likedBy.getUsername()
                + ", \"" + note.getSong().getTitle()
                + "\" şarkısındaki yorumunu beğendi";
    }

    public Long getId() { return id; }
    public User getOwner() { return owner; }
    public User getLikedBy() { return likedBy; }
    public Note getNote() { return note; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getMessage() {return message; }

    public void setOwner(User owner) { this.owner = owner; }
    public void setLikedBy(User likedBy) { this.likedBy = likedBy; }
    public void setNote(Note note) { this.note = note; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setMessage(String message) { this.message = message; }
}
