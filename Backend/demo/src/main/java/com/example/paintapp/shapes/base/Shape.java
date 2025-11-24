package com.example.paintapp.shapes.base;

import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public abstract class Shape implements Cloneable{
    protected String type;
    protected double x1,x2,y1,y2;

    protected Double angle = 0.0;
    protected Double scaleX = 1.0;
    protected Double scaleY = 1.0;

    protected Map<String, Object> properties = new HashMap<>();

    public void move(double dx, double dy){
        this.x1 += dx;
        this.y1 += dy;
    }
    public void setProperties(Map<String, Object> props){
        if(props!=null){
            this.properties.putAll(props);
        }
    }

    public Map<String, Object> getProperties(){
        return new HashMap<>(this.properties);
    }

    @Override
    public Shape clone() {
        try {
            Shape cloned = (Shape) super.clone();
            cloned.properties = new HashMap<>(this.properties);
            return cloned;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError("Cloning not supported");
        }
    }

    public double getX1() { return x1; }
    public double getY1() { return y1; }
    public double getX2() { return x2; }
    public double getY2() { return y2; }

    public void setX1(double x1) { this.x1 = x1; }
    public void setY1(double y1) { this.y1 = y1; }
    public void setX2(double x2) { this.x2 = x2; }
    public void setY2(double y2) { this.y2 = y2; }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public Double getAngle() { return angle; }
    public void setAngle(Double angle) { this.angle = angle; }

    public Double getScaleX() { return scaleX; }
    public void setScaleX(Double scaleX) { this.scaleX = scaleX; }

    public Double getScaleY() { return scaleY; }
    public void setScaleY(Double scaleY) { this.scaleY = scaleY; }

    //For Debugging
    public abstract void draw();
}