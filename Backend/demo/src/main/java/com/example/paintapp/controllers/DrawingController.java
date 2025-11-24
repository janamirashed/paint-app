package com.example.paintapp.controllers;

import com.example.paintapp.services.DrawingService;
import com.example.paintapp.services.ShapeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drawing")

public class DrawingController {

    @Autowired
    private DrawingService service;

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
}
