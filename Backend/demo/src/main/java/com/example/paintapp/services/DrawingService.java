package com.example.paintapp.services;

import com.example.paintapp.dtos.ShapeFactory;
import com.example.paintapp.shapes.base.Shape;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DrawingService {
    //to maintain insertion order and allow search by ID
    private Map<String, Shape> shapes = new LinkedHashMap<>();
    //private List<Shape> shapes = new ArrayList<>();

    private Stack<Map<String, Shape>> undoStack = new Stack<>();
    private Stack<Map<String, Shape>> redoStack = new Stack<>();
    private static final int MAX_HISTORY_SIZE = 50;

    public void saveState() {
        // Deep copy current shapes list
        Map<String, Shape> snapshot = new LinkedHashMap<>();
        for (Map.Entry<String, Shape> entry : shapes.entrySet()) {
            snapshot.put(entry.getKey(), cloneShape(entry.getValue()));
        }
        undoStack.push(snapshot);

        if (undoStack.size() > MAX_HISTORY_SIZE) {
            undoStack.remove(0);
        }
        // Clear redo stack when new action is performed
        redoStack.clear();
        System.out.println("State saved. Undo stack size: " + undoStack.size());
    }


    public void addShape(ShapeDTO dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            throw new IllegalArgumentException("Shape must have an ID");
        }

        Shape shape = ShapeFactory.createShape(dto);
        shape.setId(dto.getId());
        shapes.put(dto.getId(), shape);

        System.out.println("Shape added with ID: " + dto.getId());
    }

    public boolean updateShape(ShapeDTO dto) {
        if (dto.getId() == null || dto.getId().isEmpty()) {
            throw new IllegalArgumentException("Shape must have an ID for update");
        }

        if (shapes.containsKey(dto.getId())) {
            Shape updated = ShapeFactory.createShape(dto);
            updated.setId(dto.getId());
            shapes.put(dto.getId(), updated);

            System.out.println("Updated shape ID: " + dto.getId());
            return true;
        }

        System.out.println("Shape not found for update: " + dto.getId());
        return false;
    }

    public ShapeDTO duplicateShape(String shapeId) {
        Shape original = shapes.get(shapeId);
        if (original == null) {
            throw new IllegalArgumentException("Shape not found: " + shapeId);
        }

        // Prototype design pattern
        Shape clone = original.clone();
        clone.setId(UUID.randomUUID().toString());
        double offset = 20;
        clone.setX1(clone.getX1() + offset);
        clone.setY1(clone.getY1() + offset);
        clone.setX2(clone.getX2() + offset);
        clone.setY2(clone.getY2() + offset);

        shapes.put(clone.getId(), clone);

        saveState();
        System.out.println("Shape duplicated: original=" + shapeId + ", clone=" + clone.getId());

        return shapeToDTO(clone);
    }



    public List<ShapeDTO> getAll() {
        return shapes.values().stream().map(this::shapeToDTO).toList();
    }

    // Undo operation
    public List<ShapeDTO> undo() {
        if (undoStack.isEmpty()) {
            System.out.println("Nothing to undo");
            return getAll();
        }
        // Save current state to redo stack
        Map<String, Shape> currentSnapshot = new LinkedHashMap<>();
        for (Map.Entry<String, Shape> entry : shapes.entrySet()) {
            currentSnapshot.put(entry.getKey(), cloneShape(entry.getValue()));
        }
        redoStack.push(currentSnapshot);

        // Restore previous state
        shapes = undoStack.pop();

        System.out.println("Undo performed. Shapes count: " + shapes.size());
        return getAll();
    }

    // Redo operation
    public List<ShapeDTO> redo() {
        if (redoStack.isEmpty()) {
            System.out.println("Nothing to redo");
            return getAll();
        }
        // Save current state to undo stack
        Map<String, Shape> currentSnapshot = new LinkedHashMap<>();
        for (Map.Entry<String, Shape> entry : shapes.entrySet()) {
            currentSnapshot.put(entry.getKey(), cloneShape(entry.getValue()));
        }
        undoStack.push(currentSnapshot);

        // Restore next state
        shapes = redoStack.pop();

        System.out.println("Redo performed. Shapes count: " + shapes.size());
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
        Shape cloned = ShapeFactory.createShape(dto);
        cloned.setId(original.getId());
        return cloned;
    }

    private ShapeDTO shapeToDTO(Shape shape) {
        ShapeDTO dto = new ShapeDTO();
        dto.setId(shape.getId());
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