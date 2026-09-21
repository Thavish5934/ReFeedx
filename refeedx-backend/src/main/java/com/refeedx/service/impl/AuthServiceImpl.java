package com.refeedx.service.impl;

import com.refeedx.dto.request.LoginRequest;
import com.refeedx.dto.request.RegisterRequest;
import com.refeedx.dto.response.JwtResponse;
import com.refeedx.dto.response.UserResponse;
import com.refeedx.entity.User;
import com.refeedx.exception.AccessDeniedCustomException;
import com.refeedx.exception.BadRequestException;
import com.refeedx.repository.UserRepository;
import com.refeedx.security.JwtService;
import com.refeedx.service.AuthService;
import com.refeedx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    @Transactional
    public JwtResponse register(RegisterRequest request) {
        // UserService already rejects role=ADMIN and duplicate emails.
        UserResponse created = userService.registerUser(request);
        User user = userService.getUserEntityById(created.id());

        String token = jwtService.generateToken(user);
        return new JwtResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
        } catch (DisabledException ex) {
            // CustomUserPrincipal.isEnabled() returns false for a deactivated account - Spring
            // Security checks this before the password, so it's worth its own clear message.
            throw new AccessDeniedCustomException("This account has been deactivated. Please contact support.");
        } catch (AuthenticationException ex) {
            // Deliberately generic for bad credentials - don't reveal whether the email exists.
            throw new BadRequestException("Invalid email or password.");
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        String token = jwtService.generateToken(user);
        return new JwtResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
