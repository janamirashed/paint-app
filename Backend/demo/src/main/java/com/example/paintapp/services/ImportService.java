package com.example.paintapp.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ImportService {

    // import shapes from JSON string
    public List<ShapeDTO> importFromJSON(String jsonContent) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ShapeDTO[] shapesArray = mapper.readValue(jsonContent, ShapeDTO[].class);
        return Arrays.asList(shapesArray);
    }

    // import shapes from xml string
    public List<ShapeDTO> importFromXML(String xmlContent) throws Exception {
        XmlMapper xmlMapper = new XmlMapper();
        ExportService.DrawingWrapper wrapper = xmlMapper.readValue(xmlContent, ExportService.DrawingWrapper.class);
        return wrapper.shapes;
    }
}