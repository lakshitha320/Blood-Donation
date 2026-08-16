package com.blooddonation.inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
public class MainController {
    @GetMapping
    public ResponseEntity<String> getInventory() { return ResponseEntity.ok("Overall blood stock levels"); }
    @GetMapping("/{bloodType}")
    public ResponseEntity<String> getStockByBloodType(@PathVariable String bloodType) { return ResponseEntity.ok("Stock for blood type " + bloodType); }
    @PostMapping("/update")
    public ResponseEntity<String> updateInventory() { return ResponseEntity.ok("Inventory updated successfully"); }
}
