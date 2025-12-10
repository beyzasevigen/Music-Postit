package com.beyza.music_postit.like;

import com.beyza.music_postit.note.Note;
import com.beyza.music_postit.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    long countByNote(Note note);

    Optional<Like> findByUserAndNote(User user, Note note);

    List<Like> findByUser(User user);

    boolean existsByUserAndNote(User user, Note note);

    void deleteByUserAndNote(User user, Note note);
}
