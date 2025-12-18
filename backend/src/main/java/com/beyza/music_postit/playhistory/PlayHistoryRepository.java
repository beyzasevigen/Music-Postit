package com.beyza.music_postit.playhistory;

import com.beyza.music_postit.user.User;
import com.beyza.music_postit.song.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlayHistoryRepository extends JpaRepository<PlayHistory, Long> {

    List<PlayHistory> findByUserOrderByPlayedAtDesc(User user);

    List<PlayHistory> findByUserIdOrderByPlayedAtDesc(Long userId);

    List<PlayHistory> findByUserAndSongOrderByPlayedAtDesc(User user, Song song);
}
