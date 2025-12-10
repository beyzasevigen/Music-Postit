package com.beyza.music_postit.note;

import com.beyza.music_postit.song.Song;
import com.beyza.music_postit.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // Belirli şarkı için tüm notlar
    List<Note> findBySongOrderByTimestampSecAsc(Song song);

    // Belirli kullanıcı + şarkı için notlar
    List<Note> findByUserAndSongOrderByTimestampSecAsc(User user, Song song);

    // 🔹 YENİ: Kullanıcının tüm notları (son eklenene göre sırala)
    List<Note> findByUserOrderByCreatedAtDesc(User user);
}
