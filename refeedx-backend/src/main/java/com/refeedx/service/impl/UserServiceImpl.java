package com.refeedx.service.impl;

import com.refeedx.dto.request.ChangePasswordRequest;
import com.refeedx.dto.request.RegisterRequest;
import com.refeedx.dto.request.UpdateProfileRequest;
import com.refeedx.dto.response.UserResponse;
import com.refeedx.entity.User;
import com.refeedx.entity.enums.Role;
import com.refeedx.exception.BadRequestException;
import com.refeedx.exception.ResourceNotFoundException;
import com.refeedx.mapper.UserMapper;
import com.refeedx.repository.UserRepository;
import com.refeedx.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse registerUser(RegisterRequest request) {
        if (request.role() == Role.ADMIN) {
            throw new BadRequestException("The ADMIN role cannot be self-registered.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email already exists.");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phone(request.phone())
                .address(request.address())
                .role(request.role())
                .active(true)
                .build();

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Override
    public UserResponse getUserById(Long id) {
        return userMapper.toResponse(getUserEntityById(id));
    }

    @Override
    public User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserEntityById(userId);

        user.setName(request.name());
        user.setPhone(request.phone());
        user.setAddress(request.address());

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = getUserEntityById(userId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
