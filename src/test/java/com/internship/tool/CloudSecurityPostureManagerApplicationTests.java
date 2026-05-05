package com.internship.tool;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Smoke test — verifies that the Spring context loads without errors.
 */
@SpringBootTest
@ActiveProfiles("test")
class CloudSecurityPostureManagerApplicationTests {

    @Test
    void contextLoads() {
        // If this test passes, the application context wired up correctly.
    }
}
