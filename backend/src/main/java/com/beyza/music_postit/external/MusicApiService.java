package com.beyza.music_postit.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

@Service
public class MusicApiService {

    private final RestTemplate restTemplate;
    private final SpotifyAuthService spotifyAuthService;

    @Value("${spotify.api-base}")
    private String spotifyApiBase;

    public MusicApiService(RestTemplate restTemplate,
                           SpotifyAuthService spotifyAuthService) {
        this.restTemplate = restTemplate;
        this.spotifyAuthService = spotifyAuthService;
    }

    public List<ExternalSongDto> searchSongs(String query) {
        if (query == null || query.isBlank()) {
            return Collections.emptyList();
        }

        String encoded = UriUtils.encodeQueryParam(query, StandardCharsets.UTF_8);
        String url = spotifyApiBase + "/search?q=" + encoded + "&type=track&limit=10";

        String accessToken = spotifyAuthService.getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<SpotifySearchResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                SpotifySearchResponse.class
        );

        SpotifySearchResponse body = response.getBody();
        if (body == null || body.getTracks() == null || body.getTracks().getItems() == null) {
            return Collections.emptyList();
        }

        return body.getTracks().getItems().stream()
                .map(this::toExternalSongDto)
                .toList();
    }

    private ExternalSongDto toExternalSongDto(SpotifyTrack track) {
        String artistName = null;
        if (track.getArtists() != null && !track.getArtists().isEmpty()) {
            artistName = track.getArtists().getFirst().getName();
        }

        String albumTitle = null;
        String coverUrl = null;
        if (track.getAlbum() != null) {
            albumTitle = track.getAlbum().getName();
            if (track.getAlbum().getImages() != null && !track.getAlbum().getImages().isEmpty()) {

                coverUrl = track.getAlbum().getImages().getFirst().getUrl();
            }
        }

        Integer durationSec = null;
        if (track.getDuration_ms() != null) {
            durationSec = track.getDuration_ms() / 1000;
        }

        return new ExternalSongDto(
                track.getId(),
                track.getName(),
                artistName,
                albumTitle,
                coverUrl,
                durationSec
        );
    }
}
