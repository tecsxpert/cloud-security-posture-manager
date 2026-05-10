package com.internship.tool.repository;

import com.internship.tool.entity.SecurityRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityRecordRepository extends JpaRepository<SecurityRecord, String> {

    @Query("SELECT r FROM SecurityRecord r WHERE " +
           "LOWER(r.resourceName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.resourceType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.status) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<SecurityRecord> searchRecords(@Param("query") String query, Pageable pageable);

    List<SecurityRecord> findByStatus(String status);
    
    List<SecurityRecord> findBySeverity(String severity);
}
