package com.example.paintapp.services;

import com.example.paintapp.dtos.ShapeFactory;
import com.example.paintapp.services.ShapeDTO;
import com.example.paintapp.shapes.base.Shape;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

@Service
public class DrawingService {

    private List<Shape> shapes = new ArrayList<>();

    // Undo/Redo stacks
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
        redoStack.clear();
    }


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
    public boolean canUndo() {
        return !undoStack.isEmpty();
    }
    public boolean canRedo() {
        return !redoStack.isEmpty();
    }

    //Deep clone helper
    private Shape cloneShape(Shape original) {
        ShapeDTO dto = toDTO(original);
        return ShapeFactory.createShape(dto);
    }

    private ShapeDTO toDTO(Shape shape) {
        ShapeDTO dto = new ShapeDTO();
        dto.setType(shape.getType());
        dto.setX1((int) shape.getX1());
        dto.setY1((int) shape.getY1());
        dto.setX2((int) shape.getX2());
        dto.setY2((int) shape.getY2());
        dto.setProperties(shape.getProperties());
        return dto;
    }
}
