package com.internship.tool.service;

import com.internship.tool.entity.SecurityRecord;
import com.internship.tool.exception.BadRequestException;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.SecurityRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * Business logic layer for SecurityRecord operations.
 * <p>
 * Caching strategy:
 *   - getAll()  → @Cacheable  (reads from Redis when available)
 *   - create / update / delete → @CacheEvict (invalidates stale cache)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SecurityService {

    private final SecurityRecordRepository repository;

    // ─── READ ─────────────────────────────────────────────────────────────────

    /**
     * Retrieve all security records.
     * Result is cached in Redis under the key "securityRecords::all".
     */
    @Cacheable(value = "securityRecords", key = "'all'")
    @Transactional(readOnly = true)
    public List<SecurityRecord> getAll() {
        log.info("Fetching all security records from database");
        return repository.findAll();
    }

    /**
     * Retrieve a single security record by its ID.
     *
     * @throws ResourceNotFoundException if no record exists with the given id
     */
    @Transactional(readOnly = true)
    public SecurityRecord getById(Long id) {
        log.info("Fetching security record with id={}", id);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SecurityRecord", id));
    }

    // ─── CREATE ───────────────────────────────────────────────────────────────

    /**
     * Persist a new security record and invalidate the list cache.
     *
     * @throws BadRequestException if required fields are blank
     */
    @CacheEvict(value = "securityRecords", allEntries = true)
    public SecurityRecord create(SecurityRecord record) {
        validateRecord(record);
        log.info("Creating new security record: name={}", record.getName());
        return repository.save(record);
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    /**
     * Update an existing security record and invalidate the list cache.
     *
     * @throws ResourceNotFoundException if no record exists with the given id
     * @throws BadRequestException       if required fields are blank
     */
    @CacheEvict(value = "securityRecords", allEntries = true)
    public SecurityRecord update(Long id, SecurityRecord incoming) {
        validateRecord(incoming);

        SecurityRecord existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SecurityRecord", id));

        existing.setName(incoming.getName());
        existing.setDescription(incoming.getDescription());
        existing.setSeverity(incoming.getSeverity());
        existing.setStatus(incoming.getStatus());

        log.info("Updating security record id={}", id);
        return repository.save(existing);
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    /**
     * Delete a security record and invalidate the list cache.
     *
     * @throws ResourceNotFoundException if no record exists with the given id
     */
    @CacheEvict(value = "securityRecords", allEntries = true)
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("SecurityRecord", id);
        }
        log.info("Deleting security record id={}", id);
        repository.deleteById(id);
    }

    // ─── Validation ───────────────────────────────────────────────────────────

    private void validateRecord(SecurityRecord record) {
        if (!StringUtils.hasText(record.getName())) {
            throw new BadRequestException("Field 'name' must not be blank.");
        }
        if (!StringUtils.hasText(record.getSeverity())) {
            throw new BadRequestException("Field 'severity' must not be blank.");
        }
        if (!StringUtils.hasText(record.getStatus())) {
            throw new BadRequestException("Field 'status' must not be blank.");
        }
    }
}
