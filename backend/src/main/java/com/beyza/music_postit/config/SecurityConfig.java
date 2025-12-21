package com.beyza.music_postit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth

                        // ✅ CORS preflight (ÇOK ÖNEMLİ)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // thymeleaf sayfalar + static dosyalar açık
                        .requestMatchers(
                                "/help",
                                "/",
                                "/login",
                                "/default-ui.css",
                                "/css/**", "/js/**", "/images/**", "/favicon.ico"
                        ).permitAll()

                        // register endpoint'i açık olacak
                        .requestMatchers("/api/auth/register").permitAll()

                        // hata sayfası
                        .requestMatchers("/error").permitAll()

                        // diğer her şey için login şart
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())   // Basic Auth
                .formLogin(Customizer.withDefaults())
                .logout(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Frontend originleri (local + Render)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://music-postit-1.onrender.com"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Basic Auth / credentials için true kalabilir
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
