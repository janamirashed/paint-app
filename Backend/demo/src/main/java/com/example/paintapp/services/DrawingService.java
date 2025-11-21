@Service
public class DrawingService {

    private List<Shape> shapes = new ArrayList<>();

    public void addShape(ShapeDTO dto) {
        Shape shape = ShapeFactory.fromDTO(dto);
        shapes.add(shape);
    }

    public List<ShapeDTO> getAll() {
        return shapes.stream().map(this::toDTO).toList();
    }

    public void clear() {
        shapes.clear();
    }

    private ShapeDTO toDTO(Shape shape) {
        ShapeDTO dto = new ShapeDTO();
        dto.setType(shape.getType());
        dto.setX1(shape.x1);
        dto.setY1(shape.y1);
        dto.setX2(shape.x2);
        dto.setY2(shape.y2);
        dto.setProperties(shape.getProperties());
        return dto;
    }
}
