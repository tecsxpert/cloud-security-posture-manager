package com.internship.tool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Entry point for the Cloud Security Posture Manager application.
 */
@SpringBootApplication
@EnableCaching
public class CloudSecurityPostureManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CloudSecurityPostureManagerApplication.class, args);
    }
}
