package com.blooddonation.request.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/requests")
public class MainController {
    @GetMapping
    public ResponseEntity<String> getAllRequests() { return ResponseEntity.ok("List of blood requests"); }
    @GetMapping("/{id}")
    public ResponseEntity<String> getRequestStatus(@PathVariable String id) { return ResponseEntity.ok("Status for request " + id); }
    @PostMapping("/match")
    public ResponseEntity<String> matchDonor() { return ResponseEntity.ok("Donors matched successfully"); }
}
