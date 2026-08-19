package com.blooddonation.gateway.service;

import com.blooddonation.gateway.dto.AuthResponse;
import com.blooddonation.gateway.dto.LoginRequest;
import com.blooddonation.gateway.dto.RegisterRequest;
import com.blooddonation.gateway.dto.UserProfileResponse;
import com.blooddonation.gateway.model.User;
import com.blooddonation.gateway.model.UserRole;
import com.blooddonation.gateway.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            if (!userRepository.existsByEmail("donor@blood.lk")) {
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
                userRepository.save(donor);
            }

            if (!userRepository.existsByEmail("hospital@colombo.lk")) {
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
                userRepository.save(hospital);
            }
        };
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
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

        userRepository.save(newUser);

        String jwtToken = jwtService.generateToken(newUser.getId(), newUser.getEmail(), newUser.getRole());
        return new AuthResponse(jwtToken, newUser.getId(), newUser.getEmail(), newUser.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password!"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password!");
        }

        String jwtToken = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getRole());
    }

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));
        return new UserProfileResponse(user);
    }
}
