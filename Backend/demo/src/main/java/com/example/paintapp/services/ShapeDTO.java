package com.example.paintapp.services;

import java.util.Map;

public class ShapeDTO {
    private String type;
    private double x1, y1, x2, y2;
    private Double angle;
    private Double scaleX;
    private Double scaleY;
    private Map<String, Object> properties;

    // Constructors
    public ShapeDTO() {}

    // Getters and Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public double getX1() { return x1; }
    public void setX1(double x1) { this.x1 = x1; }

    public double getY1() { return y1; }
    public void setY1(double y1) { this.y1 = y1; }

    public double getX2() { return x2; }
    public void setX2(double x2) { this.x2 = x2; }

    public double getY2() { return y2; }
    public void setY2(double y2) { this.y2 = y2; }

    public Double getAngle() { return angle; }
    public void setAngle(Double angle) { this.angle = angle; }

    public Double getScaleX() { return scaleX; }
    public void setScaleX(Double scaleX) { this.scaleX = scaleX; }

    public Double getScaleY() { return scaleY; }
    public void setScaleY(Double scaleY) { this.scaleY = scaleY; }

    public Map<String, Object> getProperties() { return properties; }
    public void setProperties(Map<String, Object> properties) { this.properties = properties; }
}