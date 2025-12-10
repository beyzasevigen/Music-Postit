package com.beyza.music_postit.playhistory;

import com.beyza.music_postit.song.Song;
import com.beyza.music_postit.song.SongRepository;
import com.beyza.music_postit.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PlayHistoryController {

    private final PlayHistoryRepository playHistoryRepository;
    private final SongRepository songRepository;

    public PlayHistoryController(PlayHistoryRepository playHistoryRepository,
                                 SongRepository songRepository) {
        this.playHistoryRepository = playHistoryRepository;
        this.songRepository = songRepository;
    }

    // 1) Bir şarkıyı dinlemeye başladığında (veya pozisyon güncellemek için)
    @PostMapping("/play-history")
    public ResponseEntity<?> addPlayHistory(@RequestBody PlayHistoryCreateRequest request,
                                            @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        if (request.getSongId() == null) {
            return ResponseEntity.badRequest().body("songId zorunlu");
        }

        Song song = songRepository.findById(request.getSongId()).orElse(null);
        if (song == null) {
            return ResponseEntity.badRequest().body("Song not found");
        }

        PlayHistory history = new PlayHistory();
        history.setUser(currentUser);
        history.setSong(song);
        history.setLastPositionSec(request.getLastPositionSec());

        PlayHistory saved = playHistoryRepository.save(history);
        return ResponseEntity.ok(toResponse(saved));
    }

    // 2) Giriş yapmış kullanıcının dinleme geçmişi
    @GetMapping("/play-history/me")
    public ResponseEntity<?> getMyPlayHistory(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        List<PlayHistory> list = playHistoryRepository.findByUserOrderByPlayedAtDesc(currentUser);

        List<PlayHistoryResponse> responses = list.stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    private PlayHistoryResponse toResponse(PlayHistory ph) {
        return new PlayHistoryResponse(
                ph.getId(),
                ph.getSong().getId(),
                ph.getSong().getTitle(),
                ph.getSong().getArtist(),
                ph.getPlayedAt(),
                ph.getLastPositionSec()
        );
    }
}
