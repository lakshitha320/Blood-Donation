package com.blooddonation.donor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/donors")
public class MainController {
    @GetMapping
    public ResponseEntity<String> getAllDonors() { return ResponseEntity.ok("List of all donors"); }
    @GetMapping("/{id}")
    public ResponseEntity<String> getDonor(@PathVariable String id) { return ResponseEntity.ok("Donor details for " + id); }
    @GetMapping("/history")
    public ResponseEntity<String> getDonationHistory() { return ResponseEntity.ok("Donation history"); }
    @PostMapping
    public ResponseEntity<String> registerDonor() { return ResponseEntity.ok("Donor registered successfully"); }
}
