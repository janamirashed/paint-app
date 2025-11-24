package com.example.paintapp.services;

import com.example.paintapp.dtos.ShapeFactory;
import com.example.paintapp.services.ShapeDTO;
import com.example.paintapp.shapes.base.Shape;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DrawingService {

    private List<Shape> shapes = new ArrayList<>();

    public void addShape(ShapeDTO dto) {
        Shape shape = ShapeFactory.createShape(dto);
        shapes.add(shape);
    }

    public List<ShapeDTO> getAll() {
        return shapes.stream().map(this::toDTO).toList();
    }

    public void clear() {
        shapes.clear();
    }

    private ShapeDTO toDTO(Shape shape) {
        ShapeDTO dto = new ShapeDTO();
        dto.setType(shape.getType());
        dto.setX1((int) shape.getX1());
        dto.setY1((int) shape.getY1());
        dto.setX2((int) shape.getX2());
        dto.setY2((int) shape.getY2());

        dto.setAngle(shape.getAngle());
        dto.setScaleX(shape.getScaleX());
        dto.setScaleY(shape.getScaleY());

        dto.setProperties(shape.getProperties());
        return dto;
    }
}
