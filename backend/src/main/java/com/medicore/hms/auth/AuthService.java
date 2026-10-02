package com.medicore.hms.auth;

import com.medicore.hms.common.BadRequestException;
import com.medicore.hms.common.ResourceNotFoundException;
import com.medicore.hms.security.JwtTokenProvider;
import com.medicore.hms.security.UserPrincipal;
import com.medicore.hms.user.Role;
import com.medicore.hms.user.User;
import com.medicore.hms.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicore.hms.user.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        String username = request.getEmail().split("@")[0].toLowerCase().replaceAll("[^a-z0-9]", "");
        if (username.isBlank()) username = "user";
        int counter = 1;
        String finalUsername = username;
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = username + counter++;
        }

        String targetRole = request.getRole() != null ? request.getRole().toUpperCase().trim() : "DOCTOR";
        if (!targetRole.startsWith("ROLE_")) {
            targetRole = "ROLE_" + targetRole;
        }

        final String searchRole = targetRole;
        Role role = roleRepository.findByName(searchRole)
                .orElseGet(() -> roleRepository.findByName("ROLE_DOCTOR")
                        .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_DOCTOR")));

        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .username(finalUsername)
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .status("ACTIVE")
                .hospitalId(1L)
                .branchId(1L)
                .roles(roles)
                .build();

        user = userRepository.save(user);

        return login(new LoginRequest(user.getEmail(), request.getPassword()));
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String primaryRole = roleNames.isEmpty() ? "ROLE_RECEPTIONIST" : roleNames.get(0);
        String cleanRole = primaryRole.replace("ROLE_", "").toLowerCase();

        LoginResponse.UserDto userDto = LoginResponse.UserDto.builder()
                .id(user.getId().toString())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(cleanRole)
                .roles(roleNames)
                .department("Hospital Administration")
                .avatar(null)
                .build();

        return LoginResponse.builder()
                .token(accessToken)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(userDto)
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String username = tokenProvider.getUsernameFromToken(request.getRefreshToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities()
        );

        String newAccessToken = tokenProvider.generateToken(authentication);
        String newRefreshToken = tokenProvider.generateRefreshToken(authentication);

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String cleanRole = roleNames.isEmpty() ? "receptionist" : roleNames.get(0).replace("ROLE_", "").toLowerCase();

        return LoginResponse.builder()
                .token(newAccessToken)
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(LoginResponse.UserDto.builder()
                        .id(user.getId().toString())
                        .name(user.getFirstName() + " " + user.getLastName())
                        .email(user.getEmail())
                        .role(cleanRole)
                        .roles(roleNames)
                        .department("Hospital Administration")
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public LoginResponse.UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        String cleanRole = roleNames.isEmpty() ? "receptionist" : roleNames.get(0).replace("ROLE_", "").toLowerCase();

        return LoginResponse.UserDto.builder()
                .id(user.getId().toString())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(cleanRole)
                .roles(roleNames)
                .department("Hospital Administration")
                .build();
    }
}
