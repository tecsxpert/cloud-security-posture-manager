package com.internship.tool.repository;

import com.internship.tool.entity.SecurityRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for SecurityRecord.
 * Provides standard CRUD operations out of the box.
 */
@Repository
public interface SecurityRecordRepository extends JpaRepository<SecurityRecord, Long> {

    /** Find all records matching a given severity level */
    List<SecurityRecord> findBySeverity(String severity);

    /** Find all records matching a given status */
    List<SecurityRecord> findByStatus(String status);

    /** Check existence by name (useful for duplicate-name validation) */
    boolean existsByName(String name);
}
