package com.beyza.music_postit.user;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) return ResponseEntity.status(401).body("Login olmalısın");

        return ResponseEntity.ok(new MeResponse(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.getImageUrl() // yoksa şimdilik null döner
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMe(@RequestBody UpdateMeRequest req,
                                      @AuthenticationPrincipal User currentUser) {
        if (currentUser == null) return ResponseEntity.status(401).body("Login olmalısın");

        if (req.getUsername() != null && !req.getUsername().isBlank()) {
            currentUser.setUsername(req.getUsername().trim());
        }

        if (req.getImageUrl() != null) {
            currentUser.setImageUrl(req.getImageUrl().trim());
        }

        userRepository.save(currentUser);
        return ResponseEntity.ok("OK");
    }

}
