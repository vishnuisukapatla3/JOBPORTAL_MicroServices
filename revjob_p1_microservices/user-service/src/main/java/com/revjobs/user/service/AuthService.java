package com.revjobs.user.service;

import com.revjobs.common.dto.UserDTO;
import com.revjobs.common.exception.BadRequestException;
import com.revjobs.common.exception.UnauthorizedException;
import com.revjobs.user.dto.AuthResponse;
import com.revjobs.user.dto.LoginRequest;
import com.revjobs.user.dto.RegisterRequest;
import com.revjobs.user.model.Token;
import com.revjobs.user.model.TokenType;
import com.revjobs.user.model.User;
import com.revjobs.user.repository.TokenRepository;
import com.revjobs.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setActive(true);

        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);

        saveToken(user, jwtToken);

        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        return new AuthResponse(jwtToken, mapToDTO(user));
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().trim().toLowerCase(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        String jwtToken = jwtService.generateToken(user);

        revokeAllUserTokens(user);
        saveToken(user, jwtToken);

        return new AuthResponse(jwtToken, mapToDTO(user));
    }

    @Transactional
    public AuthResponse oauth2Login(String provider, String oauth2Id, String email,
            String firstName, String lastName) {
        User user = userRepository.findByOauth2ProviderAndOauth2Id(provider, oauth2Id)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirstName(firstName);
                    newUser.setLastName(lastName);
                    newUser.setOauth2Provider(provider);
                    newUser.setOauth2Id(oauth2Id);
                    newUser.setPassword(passwordEncoder.encode("OAUTH2_" + System.currentTimeMillis()));
                    newUser.setActive(true);
                    return userRepository.save(newUser);
                });

        String jwtToken = jwtService.generateToken(user);

        revokeAllUserTokens(user);
        saveToken(user, jwtToken);

        return new AuthResponse(jwtToken, mapToDTO(user));
    }

    private void saveToken(User user, String jwtToken) {
        Token token = new Token();
        token.setUser(user);
        token.setToken(jwtToken);
        token.setTokenType(TokenType.JWT);
        token.setRevoked(false);
        token.setExpiresAt(LocalDateTime.now().plusHours(24));
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validTokens = tokenRepository.findByUserAndRevokedFalse(user);
        if (validTokens.isEmpty())
            return;

        validTokens.forEach(token -> token.setRevoked(true));
        tokenRepository.saveAll(validTokens);
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setActive(user.getActive());
        return dto;
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found with email: " + email));

        // Generate 6-digit OTP
        String otp = String.format("%06d", new java.security.SecureRandom().nextInt(1000000));

        // Save OTP token
        Token token = new Token();
        token.setUser(user);
        token.setToken(otp);
        token.setTokenType(TokenType.OTP);
        token.setRevoked(false);
        token.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        tokenRepository.save(token);

        // Send email
        emailService.sendOtpEmail(user.getEmail(), otp, user.getFirstName());
    }

    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        return tokenRepository.findByUserAndRevokedFalse(user).stream()
                .anyMatch(t -> t.getTokenType() == TokenType.OTP &&
                        t.getToken().equals(otp) &&
                        !t.isExpired());
    }

    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Token validToken = tokenRepository.findByUserAndRevokedFalse(user).stream()
                .filter(t -> t.getTokenType() == TokenType.OTP &&
                        t.getToken().equals(otp) &&
                        !t.isExpired())
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Revoke OTP
        validToken.setRevoked(true);
        tokenRepository.save(validToken);
    }
}
