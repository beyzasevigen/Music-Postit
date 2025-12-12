package com.beyza.music_postit.song;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongRepository songRepository;

    public SongController(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    // 1) Tüm şarkıları listele
    @GetMapping
    public ResponseEntity<List<SongResponse>> getAllSongs() {
        List<SongResponse> songs = songRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(songs);
    }

    // 2) Tek bir şarkı getir
    @GetMapping("/{id}")
    public ResponseEntity<?> getSongById(@PathVariable Long id) {
        return songRepository.findById(id)
                .map(song -> ResponseEntity.ok(toResponse(song)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 3) Yeni şarkı ekle veya var olanı döndür (externalId üzerinden)
    @PostMapping
    public ResponseEntity<?> createSong(@RequestBody SongCreateRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()
                || request.getArtist() == null || request.getArtist().isBlank()) {
            return ResponseEntity.badRequest().body("title ve artist zorunlu");
        }

        // Eğer externalId geldiyse, var mı diye kontrol et
        if (request.getExternalId() != null && !request.getExternalId().isBlank()) {
            var existing = songRepository.findByExternalId(request.getExternalId());
            if (existing.isPresent()) {
                // zaten kayıtlı → direkt onu dön
                return ResponseEntity.ok(toResponse(existing.get()));
            }
        }

        Song song = new Song();
        song.setExternalId(request.getExternalId());
        song.setTitle(request.getTitle());
        song.setArtist(request.getArtist());
        song.setAlbum(request.getAlbum());
        song.setCoverUrl(request.getCoverUrl());
        song.setDurationSec(request.getDurationSec());

        Song saved = songRepository.save(song);
        return ResponseEntity.ok(toResponse(saved));
    }


    private SongResponse toResponse(Song song) {
        return new SongResponse(
                song.getId(),
                song.getExternalId(),
                song.getTitle(),
                song.getArtist(),
                song.getAlbum(),
                song.getCoverUrl(),
                song.getDurationSec(),
                song.getCreatedAt()
        );
    }
}
