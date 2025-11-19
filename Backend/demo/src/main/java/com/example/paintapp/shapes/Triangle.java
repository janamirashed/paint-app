package com.example.paintapp.shapes;

import com.example.paintapp.shapes.base.Shape;

public class Triangle extends Shape {
    public Triangle() {
        this.type = "Triangle";
    }

    //For Debugging
    @Override
    public void draw() {
        System.out.println("Drawing Triangle at (" + x + "," + y + ") with properties: " + properties);
    }
}