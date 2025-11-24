package com.example.paintapp.services;

import com.example.paintapp.shapes.base.Shape;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DrawingService {

    private List<ShapeDTO> shapes = new ArrayList<>();

    public void addShape(ShapeDTO dto) {
        if (dto != null && dto.getFabricJson() != null) {
            shapes.add(dto);
            System.out.println("Added shape. Total shapes: " + shapes.size());
        }
    }

    public List<ShapeDTO> getAll() {
        return new ArrayList<>(shapes);
    }

    public void clear() {
        shapes.clear();
        System.out.println("Canvas cleared. Total shapes: " + shapes.size());
    }

}
