package com.example.paintapp.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ExportService {

    // export as JSON
    public String exportAsJSON(List<ShapeDTO> shapes) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        CanvasWrapper wrapper = new CanvasWrapper();
        wrapper.version = "5.3.0";
        wrapper.objects = shapes;

        return mapper.writeValueAsString(wrapper);
    }

    // export as XML
    public String exportAsXML(List<ShapeDTO> shapes) throws Exception {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);

        DrawingWrapper wrapper = new DrawingWrapper();

        // Convert ShapeDTO to XMLShapeDTO for proper XML serialization
        wrapper.shapes = new ArrayList<>();
        for (ShapeDTO dto : shapes) {
            XMLShapeDTO xmlDto = new XMLShapeDTO();
            xmlDto.id = dto.getId();
            xmlDto.type = dto.getType();
            xmlDto.x1 = dto.getX1();
            xmlDto.y1 = dto.getY1();
            xmlDto.x2 = dto.getX2();
            xmlDto.y2 = dto.getY2();
            xmlDto.angle = dto.getAngle();
            xmlDto.scaleX = dto.getScaleX();
            xmlDto.scaleY = dto.getScaleY();
            xmlDto.properties = new XMLProperties();

            Map<String, Object> props = dto.getProperties();
            if (props != null) {
                xmlDto.properties.strokeWidth = getIntProperty(props, "strokeWidth");
                xmlDto.properties.fillColor = getStringProperty(props, "fillColor");
                xmlDto.properties.scaleX = getIntProperty(props, "scaleX");
                xmlDto.properties.scaleY = getIntProperty(props, "scaleY");
                xmlDto.properties.top = getDoubleProperty(props, "top");
                xmlDto.properties.left = getDoubleProperty(props, "left");
                xmlDto.properties.angle = getDoubleProperty(props, "angle");
                xmlDto.properties.strokeColor = getStringProperty(props, "strokeColor");
                xmlDto.properties.opacity = getDoubleProperty(props, "opacity");

                // Shape-specific properties
                if (props.containsKey("radius")) {
                    xmlDto.properties.radius = getDoubleProperty(props, "radius");
                }
                if (props.containsKey("width")) {
                    xmlDto.properties.width = getDoubleProperty(props, "width");
                }
                if (props.containsKey("height")) {
                    xmlDto.properties.height = getDoubleProperty(props, "height");
                }
                if (props.containsKey("rx")) {
                    xmlDto.properties.rx = getDoubleProperty(props, "rx");
                }
                if (props.containsKey("ry")) {
                    xmlDto.properties.ry = getDoubleProperty(props, "ry");
                }

                // Handle path for freehand
                if (props.containsKey("path")) {
                    Object pathObj = props.get("path");
                    if (pathObj instanceof List) {
                        xmlDto.properties.path = (List<Object>) pathObj;
                    } else if (pathObj instanceof String) {
                        // Split the path string into array elements
                        String pathStr = (String) pathObj;
                        xmlDto.properties.path = new ArrayList<>();
                        for (String part : pathStr.split("\\s+")) {
                            xmlDto.properties.path.add(part);
                        }
                    }
                }
            }

            wrapper.shapes.add(xmlDto);
        }

        return "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n" +
                xmlMapper.writeValueAsString(wrapper);
    }

    private String getStringProperty(Map<String, Object> props, String key) {
        Object val = props.get(key);
        return val != null ? val.toString() : null;
    }

    private Integer getIntProperty(Map<String, Object> props, String key) {
        Object val = props.get(key);
        if (val == null) return null;
        if (val instanceof Number) {
            return ((Number) val).intValue();
        }
        try {
            return Integer.parseInt(val.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double getDoubleProperty(Map<String, Object> props, String key) {
        Object val = props.get(key);
        if (val == null) return null;
        if (val instanceof Number) {
            return ((Number) val).doubleValue();
        }
        try {
            return Double.parseDouble(val.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    // XML-specific DTO classes
    @JacksonXmlRootElement(localName = "DrawingWrapper")
    public static class DrawingWrapper {
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "shapes")
        public List<XMLShapeDTO> shapes;
    }

    public static class XMLShapeDTO {
        public String id;
        public String type;
        public double x1, y1, x2, y2;
        public Double angle;
        public Double scaleX;
        public Double scaleY;
        public XMLProperties properties;
    }

    public static class XMLProperties {
        public Integer strokeWidth;
        public String fillColor;
        public Integer scaleX;
        public Integer scaleY;

        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "path")
        public List<Object> path;

        public Double top;
        public Double left;
        public Double angle;
        public String strokeColor;
        public Double opacity;

        // Shape-specific properties
        public Double radius;
        public Double width;
        public Double height;
        public Double rx;
        public Double ry;
    }

    public static class CanvasWrapper {
        public String version;
        public List<ShapeDTO> objects;
    }
}