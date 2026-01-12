package com.example.SpringBootBackend.controller;

import com.example.SpringBootBackend.dto.SurveySubmissionDto;
import com.example.SpringBootBackend.model.ApplicationUser;
import com.example.SpringBootBackend.model.UserSurvey;
import com.example.SpringBootBackend.repository.UserRepository;
import com.example.SpringBootBackend.repository.UserSurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Survey")
public class SurveyController {

    @Autowired
    private UserSurveyRepository userSurveyRepository;

    @Autowired
    private UserRepository userRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_SERVICE_URL = "http://localhost:5002";

    private String getCurrentUserId() {
        // In JwtAuthenticationFilter we set the UserDetails as principal
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            String email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            return userRepository.findByEmail(email).map(ApplicationUser::getId).orElse(null);
        }
        return null;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitSurvey(@RequestBody SurveySubmissionDto model) {
        String userId = getCurrentUserId();
        if (userId == null)
            return ResponseEntity.status(401).build();

        // Check if user already submitted today
        List<UserSurvey> userSurveys = userSurveyRepository.findByUserId(userId);
        boolean alreadySubmitted = userSurveys.stream()
                .anyMatch(s -> s.getDateTaken().toLocalDate().isEqual(LocalDate.now()));

        if (alreadySubmitted) {
            return ResponseEntity.badRequest()
                    .body(Map.of("Message", "You have already submitted your survey for today!"));
        }

        UserSurvey survey = new UserSurvey();
        survey.setUserId(userId);
        survey.setRating(model.getRating());
        survey.setDateTaken(LocalDateTime.now());

        userSurveyRepository.save(survey);

        return ResponseEntity.ok(Map.of("Message", "Survey saved successfully!"));
    }

    @PostMapping("/dump-to-model")
    public ResponseEntity<?> dumpUserData() {
        String userId = getCurrentUserId();
        if (userId == null)
            return ResponseEntity.status(401).build();

        List<UserSurvey> userSurveys = userSurveyRepository.findByUserId(userId);
        if (userSurveys.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("Message", "No data available for this user."));
        }

        // Transform to Prophet format
        List<Map<String, Object>> prophetData = userSurveys.stream()
                .sorted(Comparator.comparing(UserSurvey::getDateTaken))
                .map(s -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("ds", s.getDateTaken().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    map.put("y", s.getRating());
                    return map;
                })
                .collect(Collectors.toList());

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<List<Map<String, Object>>> request = new HttpEntity<>(prophetData, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(PYTHON_SERVICE_URL + "/receive-data", request,
                    String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.ok(Map.of("Message", "Data dumped successfully to localhost:5002"));
            } else {
                return ResponseEntity.status(response.getStatusCode()).body("Target server rejected the data.");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Failed to connect to localhost:5002: " + ex.getMessage());
        }
    }

    @GetMapping("/forecast")
    public ResponseEntity<?> getHistory() {
        String userId = getCurrentUserId();
        if (userId == null)
            return ResponseEntity.status(401).build();

        List<UserSurvey> userSurveys = userSurveyRepository.findByUserId(userId);

        List<Map<String, Object>> history = userSurveys.stream()
                .sorted(Comparator.comparing(UserSurvey::getDateTaken))
                .map(s -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("ds", s.getDateTaken().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    map.put("y", s.getRating());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "predictions", history,
                "message", !history.isEmpty() ? "History loaded" : "No data available"));
    }

    @GetMapping("/predict-future")
    public ResponseEntity<?> predictFuture() {
        String userId = getCurrentUserId();
        if (userId == null)
            return ResponseEntity.status(401).build();

        List<UserSurvey> userSurveys = userSurveyRepository.findByUserId(userId);
        if (userSurveys.size() < 2) {
            return ResponseEntity.badRequest()
                    .body(Map.of("Message", "Not enough data for prediction. Need at least 2 days of history."));
        }

        List<Map<String, Object>> history = userSurveys.stream()
                .sorted(Comparator.comparing(UserSurvey::getDateTaken))
                .map(s -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("ds", s.getDateTaken().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                    map.put("y", s.getRating());
                    return map;
                })
                .collect(Collectors.toList());

        Map<String, Object> payload = new HashMap<>();
        payload.put("data", history);
        payload.put("periods", 7);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(PYTHON_SERVICE_URL + "/predict", request,
                    String.class);

            // Return raw JSON from python service
            return ResponseEntity.status(response.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.getBody());

        } catch (Exception ex) {
            return ResponseEntity.status(500)
                    .body(Map.of("Message", "Failed to connect to prediction service", "Error", ex.getMessage()));
        }
    }

    @GetMapping("/staffing")
    public ResponseEntity<?> getStaffingOptimization() {
        String userId = getCurrentUserId();
        if (userId == null)
            return ResponseEntity.status(401).build();

        Optional<UserSurvey> latestSurvey = userSurveyRepository.findByUserId(userId).stream()
                .max(Comparator.comparing(UserSurvey::getDateTaken));

        if (latestSurvey.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("Message",
                    "No survey data found. Please submit a survey first to set your staffing capacity."));
        }

        int maxStaff = latestSurvey.get().getRating();
        String currentDay = LocalDateTime.now().getDayOfWeek().toString(); // e.g., MONDAY

        Map<String, Object> payload = new HashMap<>();
        payload.put("max_staff", maxStaff);
        payload.put("day", currentDay);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(PYTHON_SERVICE_URL + "/staffing", request,
                    String.class);

            return ResponseEntity.status(response.getStatusCode())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(response.getBody());

        } catch (Exception ex) {
            return ResponseEntity.status(500)
                    .body(Map.of("Message", "Failed to connect to staffing service", "Error", ex.getMessage()));
        }
    }
}
