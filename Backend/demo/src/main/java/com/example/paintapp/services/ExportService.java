package com.example.paintapp.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement
import org.springframework.stereotype.Service;

import java.util.List;

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
        wrapper.shapes = shapes;

        return "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n" +
                xmlMapper.writeValueAsString(wrapper);
    }

    // wrapper class for xml root element
    @JacksonXmlRootElement(localName = "DrawingWrapper")
    public static class DrawingWrapper {
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "shapes")
        public List<ShapeDTO> shapes;
    }

    public static class CanvasWrapper {
        public String version;
        public List<ShapeDTO> objects;  // Changed type
    }
}