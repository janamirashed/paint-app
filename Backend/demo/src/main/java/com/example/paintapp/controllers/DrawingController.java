package com.example.paintapp.controllers;

import com.example.paintapp.services.DrawingService;
import com.example.paintapp.services.ShapeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drawing")
public class DrawingController {

    @Autowired
    private DrawingService service;

    /**
     * Add a new shape to the canvas
     * Uses Factory Pattern inside the service to create the shape
     */
    @PostMapping("/add")
    public ResponseEntity<String> addShape(@RequestBody ShapeDTO dto) {
        try {
            service.addShape(dto);
            return ResponseEntity.ok("Shape added successfully");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    /**
     * Get all shapes from the canvas
     */
    @GetMapping("/all")
    public ResponseEntity<List<ShapeDTO>> getShapes() {
        try {
            return ResponseEntity.ok(service.getAll());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * Clear all shapes from the canvas
     */
    @DeleteMapping("/clear")
    public ResponseEntity<String> clear() {
        try {
            service.clear();
            return ResponseEntity.ok("Canvas cleared");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}