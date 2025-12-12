package com.beyza.music_postit.like;

import com.beyza.music_postit.note.Note;
import com.beyza.music_postit.note.NoteRepository;
import com.beyza.music_postit.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
public class LikeController {

    private final LikeRepository likeRepository;
    private final NoteRepository noteRepository;

    public LikeController(LikeRepository likeRepository,
                          NoteRepository noteRepository) {
        this.likeRepository = likeRepository;
        this.noteRepository = noteRepository;
    }

    // 1) Like / Unlike (toggle)
    @PostMapping("/{noteId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long noteId,
                                        @AuthenticationPrincipal User currentUser) {
        Note note = noteRepository.findById(noteId).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        boolean alreadyLiked = likeRepository.existsByUserAndNote(currentUser, note);

        if (alreadyLiked) {
            // daha önce beğenmiş → unlike yap
            likeRepository.deleteByUserAndNote(currentUser, note);
        } else {
            // beğenilmemiş → yeni like ekle
            Like like = new Like();
            like.setUser(currentUser);
            like.setNote(note);
            likeRepository.save(like);
        }

        long count = likeRepository.countByNote(note);
        LikeStatusResponse response = new LikeStatusResponse(
                note.getId(),
                !alreadyLiked,  // işlemden SONRA liked mi?
                count
        );

        return ResponseEntity.ok(response);
    }

    // 2) Sadece like sayısını almak için (opsiyonel ama faydalı)
    @GetMapping("/{noteId}/likes/count")
    public ResponseEntity<?> getLikesCount(@PathVariable Long noteId) {
        Note note = noteRepository.findById(noteId).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        long count = likeRepository.countByNote(note);
        return ResponseEntity.ok(count);
    }
}
