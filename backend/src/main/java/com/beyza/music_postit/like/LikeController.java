package com.beyza.music_postit.like;

import com.beyza.music_postit.note.Note;
import com.beyza.music_postit.note.NoteRepository;
import com.beyza.music_postit.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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

    // ✅ Like / Unlike (toggle)
    @PostMapping("/{noteId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long noteId,
                                        @AuthenticationPrincipal User currentUser) {

        Note note = noteRepository.findById(noteId).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        Long userId = currentUser.getId();

        Optional<Like> existingLike =
                likeRepository.findByUser_IdAndNote_Id(userId, noteId);

        boolean liked;

        if (existingLike.isPresent()) {
            // unlike
            likeRepository.delete(existingLike.get());
            liked = false;
        } else {
            // like
            Like like = new Like();
            like.setUser(currentUser);
            like.setNote(note);
            likeRepository.save(like);
            liked = true;
        }

        long count = likeRepository.countByNote_Id(noteId);

        return ResponseEntity.ok(new LikeStatusResponse(noteId, liked, count));
    }

    // ✅ Like sayısını getir (opsiyonel)
    @GetMapping("/{noteId}/likes/count")
    public ResponseEntity<?> getLikesCount(@PathVariable Long noteId) {

        // Not var mı kontrol (404 için)
        if (!noteRepository.existsById(noteId)) {
            return ResponseEntity.notFound().build();
        }

        long count = likeRepository.countByNote_Id(noteId);
        return ResponseEntity.ok(count);
    }
}
