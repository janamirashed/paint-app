package com.example.paintapp.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
        ExportService.DrawingWrapper wrapper = xmlMapper.readValue(
                xmlContent,
                ExportService.DrawingWrapper.class
        );
        return wrapper.shapes;
    }
}