package com.example.paintapp.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImportService {

    // import shapes from JSON string
    public List<ShapeDTO> importFromJSON(String jsonContent) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(jsonContent);

        List<ShapeDTO> shapeDTOs = new ArrayList<>();

        if (rootNode.has("objects")) {
            JsonNode objectsNode = rootNode.get("objects");
            if (objectsNode.isArray()) {
                for (JsonNode objectNode : objectsNode) {
                    ShapeDTO dto = mapper.treeToValue(objectNode, ShapeDTO.class);
                    shapeDTOs.add(dto);
                }
            }
        } else if (rootNode.isArray()) {
            // Direct array of shape objects
            for (JsonNode objectNode : rootNode) {
                ShapeDTO dto = mapper.treeToValue(objectNode, ShapeDTO.class);
                shapeDTOs.add(dto);
            }
        } else {
            // Single object
            ShapeDTO dto = mapper.treeToValue(rootNode, ShapeDTO.class);
            shapeDTOs.add(dto);
        }

        return shapeDTOs;
    }

    // import shapes from xml string
    public List<ShapeDTO> importFromXML(String xmlContent) throws Exception {
        XmlMapper xmlMapper = new XmlMapper();

        // First parse to the XML-specific wrapper
        ExportService.DrawingWrapper wrapper = xmlMapper.readValue(
                xmlContent,
                ExportService.DrawingWrapper.class
        );

        // Convert XMLShapeDTO to ShapeDTO
        List<ShapeDTO> shapeDTOs = new ArrayList<>();
        for (ExportService.XMLShapeDTO xmlDto : wrapper.shapes) {
            ShapeDTO dto = new ShapeDTO();
            dto.setId(xmlDto.id);
            dto.setType(xmlDto.type);
            dto.setX1(xmlDto.x1);
            dto.setY1(xmlDto.y1);
            dto.setX2(xmlDto.x2);
            dto.setY2(xmlDto.y2);
            dto.setAngle(xmlDto.angle);
            dto.setScaleX(xmlDto.scaleX);
            dto.setScaleY(xmlDto.scaleY);

            // Convert properties
            Map<String, Object> properties = new HashMap<>();
            if (xmlDto.properties != null) {
                ExportService.XMLProperties props = xmlDto.properties;

                if (props.strokeWidth != null) properties.put("strokeWidth", props.strokeWidth);
                if (props.fillColor != null) properties.put("fillColor", props.fillColor);
                if (props.scaleX != null) properties.put("scaleX", props.scaleX);
                if (props.scaleY != null) properties.put("scaleY", props.scaleY);
                if (props.top != null) properties.put("top", props.top);
                if (props.left != null) properties.put("left", props.left);
                if (props.angle != null) properties.put("angle", props.angle);
                if (props.strokeColor != null) properties.put("strokeColor", props.strokeColor);
                if (props.opacity != null) properties.put("opacity", props.opacity);

                // Shape-specific properties
                if (props.radius != null) properties.put("radius", props.radius);
                if (props.width != null) properties.put("width", props.width);
                if (props.height != null) properties.put("height", props.height);
                if (props.rx != null) properties.put("rx", props.rx);
                if (props.ry != null) properties.put("ry", props.ry);

                // Handle path array
                if (props.path != null && !props.path.isEmpty()) {
                    StringBuilder pathBuilder = new StringBuilder();
                    for (Object pathElement : props.path) {
                        pathBuilder.append(pathElement.toString()).append(" ");
                    }
                    properties.put("path", pathBuilder.toString().trim());
                }
            }

            dto.setProperties(properties);
            shapeDTOs.add(dto);
        }

        return shapeDTOs;
    }
}