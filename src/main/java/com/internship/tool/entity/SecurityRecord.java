package com.internship.tool.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entity representing a Security Record in the Cloud Security Posture Manager.
 */
@Entity
@Table(name = "security_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SecurityRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-readable name of the security finding */
    @Column(nullable = false, length = 255)
    private String name;

    /** Detailed description of the security issue */
    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * Severity level: LOW | MEDIUM | HIGH | CRITICAL
     */
    @Column(nullable = false, length = 50)
    private String severity;

    /**
     * Current status: OPEN | IN_PROGRESS | RESOLVED | FALSE_POSITIVE
     */
    @Column(nullable = false, length = 50)
    private String status;

    /** Automatically set when the record is first persisted */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Automatically updated whenever the record is modified */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
