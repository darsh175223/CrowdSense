package com.example.SpringBootBackend.repository;

import com.example.SpringBootBackend.model.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<ApplicationUser, String> {
    Optional<ApplicationUser> findByEmail(String email);
}
