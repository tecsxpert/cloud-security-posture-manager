package com.internship.tool.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSecurityAlert(String to, String resourceName, String severity) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Critical Security Alert: " + resourceName);

            String htmlContent = "<h2>Security Alert</h2>" +
                    "<p>A new <b>" + severity + "</b> severity issue has been detected.</p>" +
                    "<p><b>Resource:</b> " + resourceName + "</p>" +
                    "<br><p>Please check the Cloud Security Posture Manager dashboard immediately.</p>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            logger.info("Security alert email sent to {}", to);

        } catch (MessagingException e) {
            logger.error("Failed to send security alert email", e);
        }
    }

    @Scheduled(cron = "0 0 9 * * ?") // Every day at 9 AM
    public void sendDailyReminder() {
        // Logic to fetch users and send daily summary
        logger.info("Daily reminder job executed.");
    }
}
