package com.example.paintapp.controllers;

import com.example.paintapp.services.DrawingService;
import com.example.paintapp.services.ShapeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/drawing")
@CrossOrigin(
        origins = "http://localhost:4200",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
        allowedHeaders = "*",
        allowCredentials = "true"
)
public class DrawingController {

    @Autowired
    private DrawingService service;

    @PostMapping("/save-state")
    public ResponseEntity<String> saveState() {
        try {
            service.saveState();
            return ResponseEntity.ok("State saved");
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving state: " + e.getMessage());
        }
    }

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


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteShape(@PathVariable String id) {
        boolean deleted = service.deleteShape(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Shape not found");
        }
        return ResponseEntity.ok("Shape deleted successfully");
    }


    @PutMapping("/update")
    public ResponseEntity<String> updateShape(@RequestBody ShapeDTO dto) {
        try {
            boolean updated = service.updateShape(dto);

            if (updated) {
                return ResponseEntity.ok("Shape updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Shape not found");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error updating shape: " + e.getMessage());
        }
    }

    @PostMapping("/duplicate/{id}")
    public ResponseEntity<ShapeDTO> duplicateShapeEndpoint(@PathVariable String id) {
        ShapeDTO duplicateDTO = service.duplicateShape(id);
        return ResponseEntity.ok(duplicateDTO);
    }

    //Get all shapes from the canvas
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


    //Clear all shapes from the canvas
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

    @PostMapping("/undo")
    public ResponseEntity<List<ShapeDTO>> undo() {
        List<ShapeDTO> shapes = service.undo();
        return ResponseEntity.ok(shapes);
    }

    @PostMapping("/redo")
    public ResponseEntity<List<ShapeDTO>> redo() {
        List<ShapeDTO> shapes = service.redo();
        return ResponseEntity.ok(shapes);
    }

    @GetMapping("/can-undo")
    public Map<String, Boolean> canUndo() {
        Map<String, Boolean> response = new HashMap<>();
        response.put("canUndo", service.canUndo());
        return response;
    }

    @GetMapping("/can-redo")
    public Map<String, Boolean> canRedo() {
        Map<String, Boolean> response = new HashMap<>();
        response.put("canRedo", service.canRedo());
        return response;
    }
}