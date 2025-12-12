package com.beyza.music_postit.web;

import com.beyza.music_postit.user.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(@AuthenticationPrincipal User currentUser, Model model) {
        if (currentUser != null) {
            model.addAttribute("username", currentUser.getUsername());
        }
        return "home"; // templates/home.html dosyasını arayacak
    }
}
