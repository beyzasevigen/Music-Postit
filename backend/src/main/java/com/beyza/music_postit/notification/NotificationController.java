package com.beyza.music_postit.notification;

import com.beyza.music_postit.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final LikeNotificationRepository likeNotificationRepository;

    public NotificationController(LikeNotificationRepository likeNotificationRepository) {
        this.likeNotificationRepository = likeNotificationRepository;
    }

    // ✅ Yorumlarına gelen beğeniler
    @GetMapping("/likes")
    public ResponseEntity<?> myLikeNotifications(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        List<LikeNotificationResponse> res = likeNotificationRepository
                .findByOwnerOrderByCreatedAtDesc(currentUser)
                .stream()
                .limit(50)
                .map(n -> {
                    Long noteId = n.getNote() != null ? n.getNote().getId() : null;
                    Long songId = (n.getNote() != null && n.getNote().getSong() != null)
                            ? n.getNote().getSong().getId()
                            : null;

                    String songTitle = (n.getNote() != null && n.getNote().getSong() != null
                            && n.getNote().getSong().getTitle() != null)
                            ? n.getNote().getSong().getTitle()
                            : "Şarkı";

                    String likedByUsername = (n.getLikedBy() != null && n.getLikedBy().getUsername() != null)
                            ? n.getLikedBy().getUsername()
                            : "Birisi";

                    String likedByImageUrl = ""; // user'da image yoksa böyle kalsın

                    // ✅ istediğin metin burada
                    String message = likedByUsername + ", \"" + songTitle + "\" şarkısındaki yorumunu beğendi";

                    return new LikeNotificationResponse(
                            n.getId(),
                            noteId,
                            songId,
                            songTitle,
                            likedByUsername,
                            likedByImageUrl,
                            n.getCreatedAt(),
                            message
                    );
                })
                .toList();

        return ResponseEntity.ok(res);
    }
}
