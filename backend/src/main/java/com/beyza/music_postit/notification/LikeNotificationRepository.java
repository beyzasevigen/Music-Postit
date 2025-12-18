package com.beyza.music_postit.notification;

import com.beyza.music_postit.note.Note;
import com.beyza.music_postit.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeNotificationRepository extends JpaRepository<LikeNotification, Long> {

    List<LikeNotification> findByOwnerOrderByCreatedAtDesc(User owner);

    boolean existsByOwnerAndLikedByAndNote(User owner, User likedBy, Note note);

    void deleteByOwnerAndLikedByAndNote(User owner, User likedBy, Note note);
}
