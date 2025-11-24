package com.example.paintapp.shapes;

import com.example.paintapp.shapes.base.Shape;

public class Rectangle extends Shape {
    public Rectangle() {
        this.type = "Rectangle";
    }

    //For Debugging
    @Override
    public void draw() {
        System.out.println("Drawing Rectangle at (" + x1 + "," + y1 + ") with properties: " + properties);
    }
}