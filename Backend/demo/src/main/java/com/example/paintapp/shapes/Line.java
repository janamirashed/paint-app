package com.example.paintapp.shapes;

import com.example.paintapp.shapes.base.Shape;

public class Line extends Shape {
    public Line() {
        this.type = "Line";
    }

    //For Debugging
    @Override
    public void draw() {
        System.out.println("Drawing Line at (" + x1 + "," + y1 + ") with properties: " + properties);
    }
}