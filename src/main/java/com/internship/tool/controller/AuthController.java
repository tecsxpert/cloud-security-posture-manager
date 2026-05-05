package com.internship.tool.controller;

import com.internship.tool.config.AuthRequest;
import com.internship.tool.config.AuthResponse;
import com.internship.tool.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller handling login and register endpoints.
 * <p>
 * POST /auth/login    → validates credentials, returns JWT
 * POST /auth/register → demo endpoint (in-memory store; returns 501 for production note)
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    // ─── POST /auth/login ─────────────────────────────────────────────────────

    /**
     * Authenticate user credentials and return a signed JWT token.
     *
     * @param request username + password
     * @return 200 with JWT, or 401 on bad credentials
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            // Delegate authentication to Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            log.warn("Login failed for user: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, request.getUsername(), "Invalid username or password"));
        }

        // Load user details and generate token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(userDetails);

        log.info("User '{}' logged in successfully", request.getUsername());
        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername(), "Login successful"));
    }

    // ─── POST /auth/register ──────────────────────────────────────────────────

    /**
     * Registration endpoint.
     * NOTE: The in-memory UserDetailsManager does not persist across restarts.
     * Wire a database-backed UserDetailsService for production use.
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, "Username and password must not be blank"));
        }

        log.info("Register endpoint called for user: {} (in-memory — not persisted across restarts)",
                request.getUsername());

        /*
         * For a real DB-backed flow, inject UserDetailsManager and call:
         *   userDetailsManager.createUser(User.builder()
         *       .username(request.getUsername())
         *       .password(passwordEncoder.encode(request.getPassword()))
         *       .roles("USER").build());
         */

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(null, request.getUsername(),
                        "User registered (in-memory). Use /auth/login to obtain a token."));
    }
}
