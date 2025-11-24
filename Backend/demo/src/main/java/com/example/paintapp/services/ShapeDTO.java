package com.example.paintapp.services;

import java.util.Map;

public class ShapeDTO {

    private String type;
    private double x1;
    private double y1;
    private double x2;
    private double y2;

    private Double angle;
    private Double scaleX;
    private Double scaleY;

    private Map<String, Object> properties;

    public ShapeDTO() {}

    // --- TYPE ---
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    // --- COORDINATES ---
    public double getX1() {
        return x1;
    }
    public void setX1(int x1) {
        this.x1 = x1;
    }

    public double getY1() {
        return y1;
    }
    public void setY1(int y1) {
        this.y1 = y1;
    }

    public double getX2() {
        return x2;
    }
    public void setX2(int x2) {
        this.x2 = x2;
    }

    public double getY2() {
        return y2;
    }
    public void setY2(int y2) {
        this.y2 = y2;
    }

    public Double getAngle() { return angle; }
    public void setAngle(Double angle) { this.angle = angle; }

    public Double getScaleX() { return scaleX; }
    public void setScaleX(Double scaleX) { this.scaleX = scaleX; }

    public Double getScaleY() { return scaleY; }
    public void setScaleY(Double scaleY) { this.scaleY = scaleY; }

    // --- PROPERTIES MAP ---
    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }
}
