package com.example.paintapp.services;

public class ShapeDTO {
    private String fabricJson;

    public ShapeDTO() {}

    public ShapeDTO(String fabricJson) {
        this.fabricJson = fabricJson;
    }

    public String getFabricJson() {
        return fabricJson;
    }

    public void setFabricJson(String fabricJson) {
        this.fabricJson = fabricJson;
    }
}