package com.refeedx.controller.admin;

import com.refeedx.dto.request.StatusUpdateRequest;
import com.refeedx.dto.response.ContactMessageResponse;
import com.refeedx.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/messages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMessageController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<ContactMessageResponse>> listMessages(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.listMessages(status));
    }

    /** status is one of UNREAD, READ, RESOLVED. */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactMessageResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        return ResponseEntity.ok(adminService.updateMessageStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        adminService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
