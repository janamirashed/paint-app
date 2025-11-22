package com.example.paintapp.dtos;

import com.example.paintapp.services.ShapeDTO;
import com.example.paintapp.shapes.*;
import com.example.paintapp.shapes.base.Shape;

public class ShapeFactory {

    public static Shape  createShape(ShapeDTO dto) {

        if (dto == null || dto.getType() == null) {
            throw new IllegalArgumentException("Invalid ShapeDTO");
        }

        Shape shape;

        switch (dto.getType().toLowerCase()) {

            case "circle":
                shape = new Circle();
                break;

            case "ellipse":
                shape = new Ellipse();
                break;

            case "freehand":
                shape = new Freehand();
                break;

            case "line":
                shape = new Line();
                break;

            case "rectangle":
                shape = new Rectangle();
                break;

            case "square":
                shape = new Square();
                break;

            case "triangle":
                shape = new Triangle();
                break;

            default:
                throw new IllegalArgumentException("Unknown shape type: " + dto.getType());
        }

        // Set shared fields
        shape.setType(dto.getType());
        shape.setX1(dto.getX1());
        shape.setY1(dto.getY1());
        shape.setX2(dto.getX2());
        shape.setY2(dto.getY2());

        // Set all extra properties (radius, width, height, etc.)
        if (dto.getProperties() != null) {
            shape.setProperties(dto.getProperties());
        }

        return shape;
    }
}
