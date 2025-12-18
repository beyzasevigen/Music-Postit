package com.beyza.music_postit.note;

import com.beyza.music_postit.like.LikeRepository;
import com.beyza.music_postit.song.Song;
import com.beyza.music_postit.song.SongRepository;
import com.beyza.music_postit.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NoteController {

    private final NoteRepository noteRepository;
    private final SongRepository songRepository;
    private final LikeRepository likeRepository;

    public NoteController(NoteRepository noteRepository,
                          SongRepository songRepository,
                          LikeRepository likeRepository) {
        this.noteRepository = noteRepository;
        this.songRepository = songRepository;
        this.likeRepository = likeRepository;
    }

    // 1) Yeni not oluştur
    @PostMapping("/notes")
    public ResponseEntity<?> createNote(@RequestBody NoteCreateRequest request,
                                        @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        if (request.getSongId() == null || request.getTimestampSec() == null ||
                request.getText() == null || request.getText().isBlank()) {
            return ResponseEntity.badRequest().body("songId, timestampSec ve text zorunlu");
        }

        Song song = songRepository.findById(request.getSongId()).orElse(null);
        if (song == null) {
            return ResponseEntity.badRequest().body("Song not found");
        }

        Note note = new Note();
        note.setUser(currentUser);
        note.setSong(song);
        note.setTimestampSec(request.getTimestampSec());
        note.setText(request.getText());

        // ✅ Public/Private (null gelirse default: true)
        note.setPublic(request.getIsPublic() == null || request.getIsPublic());

        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(toResponse(saved, currentUser));
    }

    // 2) Bir şarkıya ait tüm notları getir
    // 🔒 Private notlar sadece sahibine görünür
    @GetMapping("/songs/{songId}/notes")
    public ResponseEntity<?> getNotesForSong(@PathVariable Long songId,
                                             @AuthenticationPrincipal User currentUser) {

        Song song = songRepository.findById(songId).orElse(null);
        if (song == null) {
            return ResponseEntity.notFound().build();
        }

        List<Note> notes = noteRepository.findBySongOrderByTimestampSecAsc(song);

        List<NoteResponse> responses = notes.stream()
                .filter(note -> {
                    // Public olanlar herkese açık
                    if (note.isPublic()) return true;

                    // Private ise sadece sahibi görebilsin
                    return currentUser != null
                            && note.getUser() != null
                            && note.getUser().getId().equals(currentUser.getId());
                })
                .map(note -> toResponse(note, currentUser))
                .toList();

        return ResponseEntity.ok(responses);
    }

    // 3) Giriş yapmış kullanıcının tüm notları
    @GetMapping("/notes/mine")
    public ResponseEntity<?> getMyNotes(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        var notes = noteRepository.findByUserOrderByCreatedAtDesc(currentUser);

        var responses = notes.stream()
                .map(note -> toResponse(note, currentUser))
                .toList();

        return ResponseEntity.ok(responses);
    }

    // 4) Bir notu güncelle (sadece sahibi)
    @PutMapping("/notes/{id}")
    public ResponseEntity<?> updateNote(@PathVariable Long id,
                                        @RequestBody NoteCreateRequest request,
                                        @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        if (!note.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("Bu notu güncelleme yetkin yok");
        }

        if (request.getText() == null || request.getText().isBlank()) {
            return ResponseEntity.badRequest().body("Text boş olamaz");
        }

        note.setText(request.getText());

        if (request.getTimestampSec() != null) {
            note.setTimestampSec(request.getTimestampSec());
        }

        // ✅ isPublic güncellemek istersen (null ise dokunma)
        if (request.getIsPublic() != null) {
            note.setPublic(request.getIsPublic());
        }

        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(toResponse(saved, currentUser));
    }

    // 5) Bir notu sil (sadece sahibi)
    @DeleteMapping("/notes/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id,
                                        @AuthenticationPrincipal User currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Login olmalısın");
        }

        Note note = noteRepository.findById(id).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        if (!note.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("Bu notu silme yetkin yok");
        }

        noteRepository.delete(note);
        return ResponseEntity.ok("Note deleted");
    }

    // ✅ liked + likesCount + isPublic hesaplayan mapper
    private NoteResponse toResponse(Note note, User currentUser) {
        Long noteId = note.getId();
        long count = likeRepository.countByNote_Id(noteId);

        boolean liked = false;
        if (currentUser != null) {
            liked = likeRepository.existsByUser_IdAndNote_Id(currentUser.getId(), noteId);
        }

        return new NoteResponse(
                note.getId(),
                note.getUser().getId(),
                note.getUser().getUsername(),
                note.getSong().getId(),
                note.getTimestampSec(),
                note.getText(),
                note.getCreatedAt(),
                liked,
                count,
                note.isPublic()
        );
    }
}
