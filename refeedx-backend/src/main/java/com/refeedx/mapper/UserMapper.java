package com.refeedx.mapper;

import com.refeedx.dto.response.UserResponse;
import com.refeedx.dto.response.UserSummaryResponse;
import com.refeedx.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) return null;

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRole(),
                user.getActive(),
                user.getCreatedAt()
        );
    }

    public UserSummaryResponse toSummary(User user) {
        if (user == null) return null;

        return new UserSummaryResponse(
                user.getId(),
                user.getName(),
                user.getPhone()
        );
    }
}
