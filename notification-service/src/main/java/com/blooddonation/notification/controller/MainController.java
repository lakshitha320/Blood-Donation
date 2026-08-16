package com.blooddonation.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notify")
public class MainController {
    @PostMapping("/email")
    public ResponseEntity<String> sendEmail() { return ResponseEntity.ok("Email sent successfully"); }
    @PostMapping("/sms")
    public ResponseEntity<String> sendSms() { return ResponseEntity.ok("SMS sent successfully"); }
    @PostMapping("/alerts")
    public ResponseEntity<String> sendAlert() { return ResponseEntity.ok("Alert sent successfully"); }
}
