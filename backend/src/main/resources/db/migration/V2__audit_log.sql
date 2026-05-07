CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    entity_name VARCHAR(255),
    performed_by VARCHAR(100) NOT NULL,
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_performed_at ON audit_logs(performed_at);
