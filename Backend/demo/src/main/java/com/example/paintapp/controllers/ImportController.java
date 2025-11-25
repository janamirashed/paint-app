package com.example.paintapp.controllers;

import com.example.paintapp.services.DrawingService;
import com.example.paintapp.services.ImportService;
import com.example.paintapp.services.ShapeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/import")
@CrossOrigin(
        origins = "http://localhost:4200",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = "*",
        allowCredentials = "true"
)
public class ImportController {

    @Autowired
    private DrawingService drawingService;

    @Autowired
    private ImportService importService;

    @PostMapping("/json")
    public ResponseEntity<String> importJSON(@RequestBody String jsonContent) {
        try {
            List<ShapeDTO> shapes = importService.importFromJSON(jsonContent);
            drawingService.clear();
            shapes.forEach(drawingService::addShape);
            return ResponseEntity.ok("Imported " + shapes.size() + " shapes");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/xml")
    public ResponseEntity<String> importXML(@RequestBody String xmlContent) {
        try {
            List<ShapeDTO> shapes = importService.importFromXML(xmlContent);
            drawingService.clear();
            shapes.forEach(drawingService::addShape);
            return ResponseEntity.ok("Imported " + shapes.size() + " shapes");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        }
    }
}