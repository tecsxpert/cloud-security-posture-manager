CREATE TABLE security_records (
    id VARCHAR(50) PRIMARY KEY,
    resource_name VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    detected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ai_description TEXT,
    ai_recommendations JSONB,
    created_by VARCHAR(100)
);

CREATE INDEX idx_security_records_severity ON security_records(severity);
CREATE INDEX idx_security_records_status ON security_records(status);
CREATE INDEX idx_security_records_type ON security_records(resource_type);
