package com.beyza.music_postit.like;

import com.beyza.music_postit.note.Note;
import com.beyza.music_postit.note.NoteRepository;
import com.beyza.music_postit.notification.LikeNotification;
import com.beyza.music_postit.notification.LikeNotificationRepository;
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
    private final LikeNotificationRepository likeNotificationRepository;

    public LikeController(LikeRepository likeRepository,
                          NoteRepository noteRepository,
                          LikeNotificationRepository likeNotificationRepository) {
        this.likeRepository = likeRepository;
        this.noteRepository = noteRepository;
        this.likeNotificationRepository = likeNotificationRepository;
    }

    // ✅ Like / Unlike (toggle)
    @PostMapping("/{noteId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long noteId,
                                        @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        Note note = noteRepository.findById(noteId).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        Long userId = currentUser.getId();

        Optional<Like> existingLike =
                likeRepository.findByUser_IdAndNote_Id(userId, noteId);

        boolean likedNow;

        if (existingLike.isPresent()) {
            // unlike
            likeRepository.delete(existingLike.get());
            likedNow = false;
        } else {
            // like
            Like like = new Like();
            like.setUser(currentUser);
            like.setNote(note);
            likeRepository.save(like);
            likedNow = true;
        }

        // ✅ Bildirim: sadece başkasının notu like'lanınca üret/sil
        User owner = note.getUser();      // not sahibi
        User likedBy = currentUser;       // like atan

        if (owner != null && !owner.getId().equals(likedBy.getId())) {
            if (likedNow) {
                // aynı kişi aynı notu tekrar like'layınca bildirim şişmesin
                boolean exists = likeNotificationRepository
                        .existsByOwnerAndLikedByAndNote(owner, likedBy, note);

                if (!exists) {
                    likeNotificationRepository.save(new LikeNotification(owner, likedBy, note));
                }
            } else {
                // unlike olunca bildirimi sil
                likeNotificationRepository.deleteByOwnerAndLikedByAndNote(owner, likedBy, note);
            }
        }

        long count = likeRepository.countByNote_Id(noteId);

        return ResponseEntity.ok(new LikeStatusResponse(noteId, likedNow, count));
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
