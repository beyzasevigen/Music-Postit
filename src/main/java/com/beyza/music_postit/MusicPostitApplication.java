package com.beyza.music_postit;

import com.beyza.music_postit.user.User;
import com.beyza.music_postit.user.UserRepository;
import com.beyza.music_postit.song.Song;
import com.beyza.music_postit.song.SongRepository;
import com.beyza.music_postit.note.Note;
import com.beyza.music_postit.note.NoteRepository;
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
    CommandLineRunner initData(
            UserRepository userRepository,
            SongRepository songRepository,
            NoteRepository noteRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder
    ) {
        return args -> {
            // Örnek kullanıcı
            // Örnek kullanıcıyı her durumda düzgün hale getir
            User user = userRepository.findByUsername("beyza").orElse(null);

            if (user == null) {
                user = new User();
                user.setUsername("beyza");
                user.setEmail("beyza@example.com");
            }

            user.setPassword(passwordEncoder.encode("secret")); // HER ZAMAN encode et
            user.setRole("ROLE_USER");
            userRepository.save(user);
            System.out.println("▶ Sample user ensured: beyza / secret");

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

            // İlk şarkıyı al
            Song firstSong = songRepository.findAll().getFirst();

            // Eğer hiç note yoksa, örnek bir tane ekleyelim
            if (noteRepository.count() == 0) {
                Note note = new Note();
                note.setUser(user);
                note.setSong(firstSong);
                note.setTimestampSec(42); // şarkının 42. saniyesi
                note.setText("Bu kısımda sözler çok hoşuma gidiyor 💛");

                noteRepository.save(note);
                System.out.println("▶ Sample note created at 42s for song: " + firstSong.getTitle());
            }
        };
    }
}
