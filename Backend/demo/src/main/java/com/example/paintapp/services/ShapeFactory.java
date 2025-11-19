package com.example.paintapp.services;

import com.example.paintapp.dtos.ShapeDTO;
import com.example.paintapp.shapes.Circle;
import com.example.paintapp.shapes.Ellipse;
import com.example.paintapp.shapes.Line;
import com.example.paintapp.shapes.Rectangle;
import com.example.paintapp.shapes.Square;
import com.example.paintapp.shapes.Triangle;
import com.example.paintapp.shapes.base.Shape;

public class ShapeFactory {

    public Shape createShape(ShapeDTO dto) {

        if (dto == null || dto.getType() == null) {
            throw new IllegalArgumentException("Invalid shape DTO");
        }

        Shape shape;

        switch (dto.getType().toLowerCase()) {

            case "circle":
                shape = new Circle(dto.getX(), dto.getY(), dto.getRadius());
                break;

            case "line":
                shape = new Line(dto.getX(), dto.getY(), dto.getX2(), dto.getY2());
                break;

            case "rectangle":
                shape = new Rectangle(dto.getX(), dto.getY(), dto.getWidth(), dto.getHeight());
                break;

            case "triangle":
                shape = new Triangle(
                        dto.getX(), dto.getY(),
                        dto.getX2(), dto.getY2(),
                        dto.getX3(), dto.getY3()
                );
                break;

            case "square":
                shape = new Square(dto.getX(), dto.getY(), dto.getSideLength());
                break;

            case "ellipse":
                shape = new Ellipse(dto.getX(), dto.getY(), dto.getRadiusX(), dto.getRadiusY());
                break;

            default:
                throw new IllegalArgumentException("Unknown shape type: " + dto.getType());
        }

        shape.type = dto.getType();
        shape.x = dto.getX();
        shape.y = dto.getY();
        shape.fillColor = dto.getFillColor();
        shape.borderWidth = dto.getBorderWidth();
        shape.borderColor = dto.getBorderColor();

        return shape;
    }
}
