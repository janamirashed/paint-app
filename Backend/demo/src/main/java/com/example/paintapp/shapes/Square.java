package com.example.paintapp.shapes;

import com.example.paintapp.shapes.base.Shape;

public class Square extends Shape {
    public Square() {
        this.type = "Square";
    }

    //For Debugging
    @Override
    public void draw() {
        System.out.println("Drawing Square at (" + x1 + "," + y1 + ") with properties: " + properties);
    }
}