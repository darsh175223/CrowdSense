package com.example.SpringBootBackend.controller;

import com.example.SpringBootBackend.dto.LoginDto;
import com.example.SpringBootBackend.dto.RegisterDto;
import com.example.SpringBootBackend.model.ApplicationUser;
import com.example.SpringBootBackend.repository.UserRepository;
import com.example.SpringBootBackend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/Auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("Message", "Email already in use!"));
        }

        ApplicationUser user = new ApplicationUser();
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword())); // Hash password
        user.setFirstName(registerDto.getFirstName());
        user.setLastName(registerDto.getLastName());

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("Message", "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        Optional<ApplicationUser> userOpt = userRepository.findByEmail(loginDto.getEmail());

        if (userOpt.isPresent() && passwordEncoder.matches(loginDto.getPassword(), userOpt.get().getPassword())) {
            String token = jwtUtils.generateToken(userOpt.get());
            return ResponseEntity.ok(Map.of("Token", token));
        }

        return ResponseEntity.status(401).body(Map.of("Message", "Invalid email or password"));
    }
}
