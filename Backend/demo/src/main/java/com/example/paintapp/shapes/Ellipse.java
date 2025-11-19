package com.example.paintapp.shapes;

import com.example.paintapp.shapes.base.Shape;

public class Ellipse extends Shape {
    public Ellipse() {
        this.type = "Ellipse";
    }

    //For Debugging
    @Override
    public void draw() {
        System.out.println("Drawing Ellipse at (" + x + "," + y + ") with properties: " + properties);
    }
}