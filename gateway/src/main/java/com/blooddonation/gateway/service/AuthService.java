package com.blooddonation.gateway.service;

import com.blooddonation.gateway.dto.AuthResponse;
import com.blooddonation.gateway.dto.LoginRequest;
import com.blooddonation.gateway.dto.RegisterRequest;
import com.blooddonation.gateway.dto.UserProfileResponse;
import com.blooddonation.gateway.model.User;
import com.blooddonation.gateway.model.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final Map<String, User> userMapByEmail = new ConcurrentHashMap<>();
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;

        // Seed Default Users for immediate testing
        seedDefaultUsers();
    }

    private void seedDefaultUsers() {
        User donor = new User(
            "USR-101",
            "donor@blood.lk",
            passwordEncoder.encode("password123"),
            "Kasun Perera",
            "O+",
            "Colombo",
            "+94 77 123 4567",
            UserRole.DONOR
        );
        userMapByEmail.put(donor.getEmail(), donor);

        User hospital = new User(
            "USR-102",
            "hospital@colombo.lk",
            passwordEncoder.encode("hospital123"),
            "National Hospital Colombo",
            "ALL",
            "Colombo",
            "+94 11 269 1111",
            UserRole.HOSPITAL
        );
        userMapByEmail.put(hospital.getEmail(), hospital);
    }

    public AuthResponse register(RegisterRequest req) {
        if (userMapByEmail.containsKey(req.getEmail())) {
            throw new IllegalArgumentException("User with email " + req.getEmail() + " already exists!");
        }

        String userId = "USR-" + UUID.randomUUID().toString().substring(0, 8);
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        User newUser = new User(
            userId,
            req.getEmail(),
            encodedPassword,
            req.getFullName(),
            req.getBloodGroup() != null ? req.getBloodGroup() : "O+",
            req.getCity() != null ? req.getCity() : "Colombo",
            req.getPhone() != null ? req.getPhone() : "",
            req.getRole()
        );

        userMapByEmail.put(newUser.getEmail(), newUser);

        String jwtToken = jwtService.generateToken(newUser.getId(), newUser.getEmail(), newUser.getRole());
        return new AuthResponse(jwtToken, newUser.getId(), newUser.getEmail(), newUser.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userMapByEmail.get(req.getEmail());
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password!");
        }

        String jwtToken = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getRole());
    }

    public UserProfileResponse getProfile(String email) {
        User user = userMapByEmail.get(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found!");
        }
        return new UserProfileResponse(user);
    }
}
