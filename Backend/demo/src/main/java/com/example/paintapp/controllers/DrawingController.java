@RestController
@RequestMapping("/drawing")
@CrossOrigin(origins = "*")
public class DrawingController {

    @Autowired
    private DrawingService service;

    @PostMapping("/add")
    public void addShape(@RequestBody ShapeDTO dto) {
        service.addShape(dto);
    }

    @GetMapping("/all")
    public List<ShapeDTO> getShapes() {
        return service.getAll();
    }

    @DeleteMapping("/clear")
    public void clear() {
        service.clear();
    }
}
