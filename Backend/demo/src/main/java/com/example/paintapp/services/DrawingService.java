package com.example.paintapp.services;

import com.example.paintapp.dtos.ShapeFactory;
import com.example.paintapp.shapes.base.Shape;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;
import java.util.stream.Collectors;

@Service
public class DrawingService {

    private List<Shape> shapes = new ArrayList<>();
    private Stack<List<Shape>> undoStack = new Stack<>();
    private Stack<List<Shape>> redoStack = new Stack<>();
    private static final int MAX_HISTORY_SIZE = 50;

    public void saveState() {
        // Deep copy current shapes list
        List<Shape> snapshot = new ArrayList<>();
        for (Shape shape : shapes) {
            snapshot.add(cloneShape(shape));
        }
        undoStack.push(snapshot);
        if (undoStack.size() > MAX_HISTORY_SIZE) {
            undoStack.remove(0);
        }
        // Clear redo stack when new action is performed
        redoStack.clear();
    }


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

    // Undo operation
    public List<ShapeDTO> undo() {
        if (undoStack.isEmpty()) {
            return getAll();
        }
        // Save current state to redo stack
        List<Shape> currentSnapshot = new ArrayList<>();
        for (Shape shape : shapes) {
            currentSnapshot.add(cloneShape(shape));
        }
        redoStack.push(currentSnapshot);
        // Restore previous state
        shapes = undoStack.pop();
        return getAll();
    }

    // Redo operation
    public List<ShapeDTO> redo() {
        if (redoStack.isEmpty()) {
            return getAll();
        }
        // Save current state to undo stack
        List<Shape> currentSnapshot = new ArrayList<>();
        for (Shape shape : shapes) {
            currentSnapshot.add(cloneShape(shape));
        }
        undoStack.push(currentSnapshot);
        // Restore next state
        shapes = redoStack.pop();
        return getAll();
    }

    // Check if undo/redo are available
    public boolean canUndo() {
        return !undoStack.isEmpty();
    }
    public boolean canRedo() {
        return !redoStack.isEmpty();
    }

    private Shape cloneShape(Shape original) {
        ShapeDTO dto = shapeToDTO(original);
        return ShapeFactory.createShape(dto);
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