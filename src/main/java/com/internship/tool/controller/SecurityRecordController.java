package com.internship.tool.controller;

import com.internship.tool.entity.SecurityRecord;
import com.internship.tool.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing CRUD endpoints for SecurityRecord.
 * All routes are prefixed with /api/records.
 */
@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class SecurityRecordController {

    private final SecurityService securityService;

    // ─── GET /api/records ─────────────────────────────────────────────────────

    /**
     * Returns all security records.
     * Response is served from Redis cache when available (cache-aside pattern).
     */
    @GetMapping
    public ResponseEntity<List<SecurityRecord>> getAll() {
        return ResponseEntity.ok(securityService.getAll());
    }

    // ─── GET /api/records/{id} ────────────────────────────────────────────────

    /**
     * Returns a single security record by its ID.
     * Responds with 404 if the record does not exist.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SecurityRecord> getById(@PathVariable Long id) {
        return ResponseEntity.ok(securityService.getById(id));
    }

    // ─── POST /api/records ────────────────────────────────────────────────────

    /**
     * Creates a new security record.
     * Responds with 201 Created and the persisted entity.
     */
    @PostMapping
    public ResponseEntity<SecurityRecord> create(@RequestBody SecurityRecord record) {
        SecurityRecord created = securityService.create(record);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ─── PUT /api/records/{id} ────────────────────────────────────────────────

    /**
     * Fully updates an existing security record.
     * Responds with 404 if the record does not exist.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SecurityRecord> update(
            @PathVariable Long id,
            @RequestBody SecurityRecord record) {
        return ResponseEntity.ok(securityService.update(id, record));
    }

    // ─── DELETE /api/records/{id} ─────────────────────────────────────────────

    /**
     * Deletes a security record.
     * Responds with 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        securityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
