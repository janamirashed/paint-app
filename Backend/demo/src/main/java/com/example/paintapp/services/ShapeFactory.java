package com.example.paintapp.services;

import com.example.paintapp.shapes.*;
import com.example.paintapp.shapes.Rectangle;
import com.example.paintapp.shapes.base.Shape;

public class ShapeFactory {

    public static Shape  createShape(ShapeDTO dto) {

        if (dto == null || dto.getType() == null) {
            throw new IllegalArgumentException("Invalid ShapeDTO");
        }

        Shape shape = switch (dto.getType().toLowerCase()){
            case "circle" -> new Circle();
            case "rectangle" -> new Rectangle();
            case "square" -> new Square();
            case "triangle" -> new Triangle();
            case "line" -> new Line();
            case "ellipse" -> new Ellipse();
            case "freehand", "path" -> new Freehand();
            default -> throw new IllegalArgumentException("Invalid shape type: " + dto.getType());
        };

        // Set shared fields
        shape.setId(dto.getId());
        shape.setType(dto.getType());
        shape.setX1(dto.getX1());
        shape.setY1(dto.getY1());
        shape.setX2(dto.getX2());
        shape.setY2(dto.getY2());
        shape.setAngle(dto.getAngle());
        shape.setScaleX(dto.getScaleX());
        shape.setScaleY(dto.getScaleY());

//        if (dto.getAngle() != null) {
//            shape.setAngle(dto.getAngle());
//        }
//        if (dto.getScaleX() != null) {
//            shape.setScaleX(dto.getScaleX());
//        }
//        if (dto.getScaleY() != null) {
//            shape.setScaleY(dto.getScaleY());
//        }

        // Set all extra properties (radius, width, height, etc.)
        if (dto.getProperties() != null) {
            shape.setProperties(dto.getProperties());
        }

        return shape;
    }
}
