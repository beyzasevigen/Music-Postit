package com.beyza.music_postit.like;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUser_IdAndNote_Id(Long userId, Long noteId);

    long countByNote_Id(Long noteId);

    boolean existsByUser_IdAndNote_Id(Long userId, Long noteId);
}
