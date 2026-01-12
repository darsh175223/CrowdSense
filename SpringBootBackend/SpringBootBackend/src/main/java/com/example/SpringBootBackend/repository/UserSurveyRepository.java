package com.example.SpringBootBackend.repository;

import com.example.SpringBootBackend.model.UserSurvey;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserSurveyRepository extends JpaRepository<UserSurvey, Long> {
    List<UserSurvey> findByUserId(String userId);
}
