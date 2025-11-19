package com.example.paintapp.shapes;

import com.example.paintapp.shapes.base.Shape;

import java.awt.Point;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Freehand extends Shape {

    public Freehand() {
        this.type = "Freehand";
        this.properties.put("points", new ArrayList<Point>());
    }

    @SuppressWarnings("unchecked")
    public void addPoint(int x, int y) {
        List<Point> points = (List<Point>) this.properties.get("points");
        points.add(new Point(x, y));
    }

    @Override
    @SuppressWarnings("unchecked")
    public void move(double dx, double dy) {
        List<Point> points = (List<Point>) this.properties.get("points");
        for (Point p : points) {
            p.x += dx;
            p.y += dy;
        }
    }

    @Override
    public Shape clone() {
        Freehand cloned = (Freehand) super.clone();
        @SuppressWarnings("unchecked")
        List<Point> originalPoints = (List<Point>) this.properties.get("points");
        List<Point> clonedPoints = new ArrayList<>();
        for (Point p : originalPoints) {
            clonedPoints.add(new Point(p.x, p.y));
        }
        cloned.properties.put("points", clonedPoints);
        return cloned;
    }


    //For Debugging
    @Override
    public void draw() {
        @SuppressWarnings("unchecked")
        List<Point> points = (List<Point>) this.properties.get("points");
        System.out.println("Drawing Freehand with points: " + points);
    }
}
