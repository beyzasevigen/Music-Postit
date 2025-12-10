package com.beyza.music_postit.external;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class SpotifyAuthService {

    @Value("${spotify.client-id}")
    private String clientId;

    @Value("${spotify.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate;

    public SpotifyAuthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getAccessToken() {
        String url = "https://accounts.spotify.com/api/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // Basic base64(clientId:clientSecret)
        String creds = clientId + ":" + clientSecret;
        String basicAuth = Base64.getEncoder()
                .encodeToString(creds.getBytes(StandardCharsets.UTF_8));
        headers.set("Authorization", "Basic " + basicAuth);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<SpotifyTokenResponse> response = restTemplate.postForEntity(
                url,
                request,
                SpotifyTokenResponse.class
        );

        if (response.getBody() == null || response.getBody().getAccess_token() == null) {
            throw new RuntimeException("Spotify token alınamadı");
        }

        return response.getBody().getAccess_token();
    }
}
