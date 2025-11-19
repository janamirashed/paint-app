package com.example.paintapp.shapes;

import com.example.paintapp.shapes.base.Shape;

public class Circle extends Shape {
    public Circle() {
        this.type = "Circle";
    }

    //For Debugging
    @Override
    public void draw() {
        System.out.println("Drawing Circle at (" + x + "," + y + ") with properties: " + properties);
    }
}