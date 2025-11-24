package com.example.paintapp.controllers;

import com.example.paintapp.services.DrawingService;
import com.example.paintapp.services.ShapeDTO;
import org.springframework.beans.factory.annotation.Autowired;
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
    public void saveState() {
        service.saveState();
    }

    @PostMapping("/add")
    public void addShape(@RequestBody ShapeDTO dto) {
        service.addShape(dto);
    }

    @GetMapping("/all")
    public List<ShapeDTO> getShapes() {
        return service.getAll();
    }

    @DeleteMapping("/clear")
    public void clear() {
        service.clear();
    }
    @PostMapping("/undo")
    public List<ShapeDTO> undo() {
        return service.undo();
    }

    @PostMapping("/redo")
    public List<ShapeDTO> redo() {
        return service.redo();
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
