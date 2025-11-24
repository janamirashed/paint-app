package com.example.paintapp.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExportService {

    // export as JSON
    public String exportAsJSON(List<ShapeDTO> shapes) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        return mapper.writeValueAsString(shapes);
    }

    // export as XML
    public String exportAsXML(List<ShapeDTO> shapes) throws Exception {
        XmlMapper xmlMapper = new XmlMapper();
        xmlMapper.enable(SerializationFeature.INDENT_OUTPUT);

        DrawingWrapper wrapper = new DrawingWrapper();
        wrapper.shapes = shapes;

        return "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n" +
                xmlMapper.writeValueAsString(wrapper);
    }

    // wrapper class for xml root element
    public static class DrawingWrapper {
        public List<ShapeDTO> shapes;
    }
}