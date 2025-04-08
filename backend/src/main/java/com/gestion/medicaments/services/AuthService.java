package com.gestion.medicaments.services;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestion.medicaments.exceptions.TokenRefreshException;
import com.gestion.medicaments.models.ERole;
import com.gestion.medicaments.models.Role;
import com.gestion.medicaments.models.User;
import com.gestion.medicaments.payload.request.LoginRequest;
import com.gestion.medicaments.payload.request.SignupRequest;
import com.gestion.medicaments.payload.response.JwtResponse;
import com.gestion.medicaments.payload.response.MessageResponse;
import com.gestion.medicaments.repositories.RoleRepository;
import com.gestion.medicaments.repositories.UserRepository;
import com.gestion.medicaments.security.jwt.JwtUtils;
import com.gestion.medicaments.security.services.UserDetailsImpl;

@Service
public class AuthService {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;
    
    @Autowired
    EmailService emailService;
    
    @Value("${app.reset-password.token.expiration}")
    private long resetPasswordTokenExpirationMs;
    
    @Value("${app.url}")
    private String appUrl;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponse(jwt, "Bearer", userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(),
                roles);
    }

    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new MessageResponse("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new MessageResponse("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                case "admin":
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                    break;
                default:
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return new MessageResponse("User registered successfully!");
    }
    
    public MessageResponse processForgotPassword(String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    String token = UUID.randomUUID().toString();
                    user.setResetToken(token);
                    user.setResetTokenExpiration(LocalDateTime.now().plusSeconds(resetPasswordTokenExpirationMs / 1000));
                    userRepository.save(user);
                    
                    String resetUrl = appUrl + "/reset-password?token=" + token;
                    emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
                    
                    return new MessageResponse("Password reset link has been sent to your email");
                })
                .orElse(new MessageResponse("If your email exists in our system, you will receive a password reset link"));
    }
    
    public MessageResponse processResetPassword(String token, String newPassword) {
        return userRepository.findByResetToken(token)
                .map(user -> {
                    if (!user.isResetTokenValid()) {
                        throw new TokenRefreshException(token, "Reset password token was expired!");
                    }
                    
                    user.setPassword(encoder.encode(newPassword));
                    user.setResetToken(null);
                    user.setResetTokenExpiration(null);
                    userRepository.save(user);
                    
                    return new MessageResponse("Password has been reset successfully");
                })
                .orElseThrow(() -> new TokenRefreshException(token, "Invalid reset password token!"));
    }
} 