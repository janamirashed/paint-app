package com.example.paintapp.shapes.base;

import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public abstract class Shape implements Cloneable{
    protected String type;
    protected int x;
    protected int y;
    protected Map<String, Object> properties = new HashMap<>();


    public void move(double dx, double dy){
        this.x += dx;
        this.y += dy;
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

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    //For Debugging
    public abstract void draw();
}