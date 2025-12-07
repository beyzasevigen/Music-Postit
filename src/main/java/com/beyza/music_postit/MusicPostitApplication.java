package com.beyza.music_postit;

import com.beyza.music_postit.user.User;
import com.beyza.music_postit.user.UserRepository;
import com.beyza.music_postit.song.Song;
import com.beyza.music_postit.song.SongRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MusicPostitApplication {

    public static void main(String[] args) {
        SpringApplication.run(MusicPostitApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UserRepository userRepository, SongRepository songRepository) {
        return args -> {
            // Örnek kullanıcı
            if (userRepository.count() == 0) {
                User user = new User();
                user.setUsername("beyza");
                user.setEmail("beyza@example.com");
                user.setPassword("secret"); // sonra şifreleme ekleyeceğiz
                userRepository.save(user);
                System.out.println("▶ Sample user created: beyza");
            }

            // Örnek şarkılar
            if (songRepository.count() == 0) {
                Song s1 = new Song();
                s1.setTitle("Lovely Day");
                s1.setArtist("Bill Withers");
                s1.setAlbum("Menagerie");
                s1.setDurationSec(210);

                Song s2 = new Song();
                s2.setTitle("Yellow");
                s2.setArtist("Coldplay");
                s2.setAlbum("Parachutes");
                s2.setDurationSec(260);

                songRepository.save(s1);
                songRepository.save(s2);

                System.out.println("▶ Sample songs created");
            }
        };
    }
}
