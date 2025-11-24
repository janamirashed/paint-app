package com.example.paintapp.controllers;

import com.example.paintapp.services.DrawingService;
import com.example.paintapp.services.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/export")

public class ExportController {
    @Autowired
    private ExportService exportService;
    @Autowired
    private DrawingService drawingService;

    @GetMapping("/json")
    public ResponseEntity<String> exportJSON() {
        try {
            String json = exportService.exportAsJSON(drawingService.getAll());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=drawing.json")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(json);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/xml")
    public ResponseEntity<String> exportXML() {
        try {
            String xml = exportService.exportAsXML(drawingService.getAll());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=drawing.xml")
                    .contentType(MediaType.APPLICATION_XML)
                    .body(xml);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
}