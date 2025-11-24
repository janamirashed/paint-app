package com.example.paintapp.services;

import com.example.paintapp.dtos.ShapeFactory;
import com.example.paintapp.shapes.base.Shape;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DrawingService {

    private List<Shape> shapes = new ArrayList<>();

    public void addShape(ShapeDTO dto) {
        try {
            // Use Factory Pattern to create shape
            Shape shape = ShapeFactory.createShape(dto);
            shapes.add(shape);
            System.out.println("Added " + shape.getType() + ". Total shapes: " + shapes.size());
        } catch (Exception e) {
            System.err.println("Error creating shape: " + e.getMessage());
        }
    }

    public List<ShapeDTO> getAll() {
        // Convert shapes back to DTOs
        return shapes.stream()
                .map(this::shapeToDTO)
                .collect(Collectors.toList());
    }

    private ShapeDTO shapeToDTO(Shape shape) {
        ShapeDTO dto = new ShapeDTO();
        dto.setType(shape.getType());
        dto.setX1(shape.getX1());
        dto.setY1(shape.getY1());
        dto.setX2(shape.getX2());
        dto.setY2(shape.getY2());
        dto.setAngle(shape.getAngle());
        dto.setScaleX(shape.getScaleX());
        dto.setScaleY(shape.getScaleY());
        dto.setProperties(shape.getProperties());
        return dto;
    }

    public void clear() {
        shapes.clear();
        System.out.println("Canvas cleared. Total shapes: " + shapes.size());
    }
}