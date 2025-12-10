package com.beyza.music_postit.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

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
                .csrf(csrf -> csrf.disable()) // şimdilik kolaylık için
                .authorizeHttpRequests(auth -> auth
                        // register endpoint'i açık olacak
                        .requestMatchers("/api/auth/register").permitAll()
                        // Hata sayfası vs.
                        .requestMatchers("/error").permitAll()
                        // diğer her şey için login şart
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults())   // Basic Auth (Postman için)
                // şimdilik Spring'in hazır login formunu kullanıyoruz
                .formLogin(Customizer.withDefaults())
                .logout(Customizer.withDefaults());

        return http.build();
    }
}
