package com.beyza.music_postit.external;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/external")
public class MusicApiController {

    private final MusicApiService musicApiService;

    public MusicApiController(MusicApiService musicApiService) {
        this.musicApiService = musicApiService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<ExternalSongDto>> search(@RequestParam String query) {
        List<ExternalSongDto> results = musicApiService.searchSongs(query);
        return ResponseEntity.ok(results);
    }
}
