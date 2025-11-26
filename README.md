# 🎨 Paint Application

A modern, full-stack vector graphics editor built with Angular and Spring Boot. Create, edit, and manipulate shapes with an intuitive interface supporting real-time drawing, undo/redo functionality, and file import/export capabilities.
📸 Application Overview
Full application interface with drawing canvas, toolbars, and properties panel
./assets/ui/drawing-demo.jpg

## ✨ Features

### Drawing Tools
- **Shape Tools**: Rectangle, Square, Circle, Ellipse, Triangle, Line
- **Freehand Drawing**: Pencil tool with smooth path rendering
- **Selection Tool**: Move, resize, rotate, and transform objects
- **Multi-Selection**: Select and manipulate multiple shapes simultaneously

### Canvas Operations
- **Undo/Redo**: Full history management with 50-state capacity
- **Duplicate**: Clone shapes with a single click
- **Delete**: Remove selected objects from canvas
- **Clear Canvas**: Remove all objects at once

### Customization
- **Stroke Properties**: Color, width (1-20px), and style
- **Fill Properties**: Solid colors or transparent fills
- **Opacity Control**: Adjust transparency (0-100%)
- **Color Picker**: Quick presets + custom color selection

### Data Persistence
- **Export Formats**: Save drawings as JSON or XML
- **Import Formats**: Load existing JSON/XML files
- **Backend Storage**: Persistent state management
- **Auto-sync**: Changes automatically saved to backend

## 🏗️ Architecture

### Frontend (Angular 20.3.0)
```
Frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── canvas/           # Main drawing canvas
│   │   │   ├── header-toolbar/   # Top toolbar with actions
│   │   │   ├── side-toolbar/     # Shape selection sidebar
│   │   │   └── properties-panel/ # Style customization
│   │   ├── services/
│   │   │   ├── canvas-states.ts      # Undo/redo management
│   │   │   ├── create-fabric-object.ts # DTO to Fabric conversion
│   │   │   ├── draw.ts               # Shape drawing logic
│   │   │   ├── fabric-to-dto.ts      # Fabric to DTO conversion
│   │   │   ├── http.service.ts       # API communication
│   │   │   ├── load-shapes.ts        # Canvas loading
│   │   │   └── update-shape.ts       # Shape persistence
│   │   └── dtos/
│   │       └── ShapeDTO.ts       # Data transfer object
│   └── ...
```

### Backend (Spring Boot 3.5.7)
```
Backend/demo/src/main/java/com/example/paintapp/
├── controllers/
│   ├── DrawingController.java    # Canvas operations API
│   ├── ExportController.java     # File export endpoints
│   └── ImportController.java     # File import endpoints
├── services/
│   ├── DrawingService.java       # Core business logic
│   ├── ExportService.java        # JSON/XML serialization
│   └── ImportService.java        # JSON/XML parsing
├── shapes/
│   ├── base/Shape.java           # Abstract shape class
│   ├── Circle.java
│   ├── Ellipse.java
│   ├── Freehand.java
│   ├── Line.java
│   ├── Rectangle.java
│   ├── Square.java
│   └── Triangle.java
└── ShapeFactory.java             # Factory pattern implementation
```

### Design Patterns Used
- **Factory Pattern**: `ShapeFactory` for shape instantiation
- **Prototype Pattern**: Shape cloning for duplication
- **Data Transfer Object (DTO)**: Decoupled frontend-backend communication
- **MVC Layer**: Separation of business logic from controllers

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **npm** (v9+)
- **Java JDK** (17+)
- **Maven** (3.9+)

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd paint-application
```

#### 2. Backend Setup
```bash
cd Backend/demo

# Install dependencies and run
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```
Backend will start on `http://localhost:8080`

#### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm start
```
Frontend will start on `http://localhost:4200`

### Running Tests
```bash
# Frontend tests
cd Frontend
npm test

# Backend tests
cd Backend/demo
./mvnw test
```

## 📖 Usage Guide

### Basic Drawing
1. Select a shape tool from the left sidebar
2. Click and drag on the canvas to draw
3. Use the selection tool to modify existing shapes

### Customizing Shapes
1. Select a shape with the selection tool
2. Adjust properties in the right panel:
   - Stroke color and width
   - Fill color
   - Opacity

### Managing History
- **Undo**: Click undo button or use keyboard shortcut
- **Redo**: Click redo button or use keyboard shortcut
- **Clear**: Remove all shapes from canvas

### Saving & Loading
- **Save JSON**: Export drawing in JSON format
- **Save XML**: Export drawing in XML format
- **Load**: Import existing JSON/XML files

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 20.3.0
- **Canvas Library**: Fabric.js 6.9.0
- **HTTP Client**: Angular HttpClient
- **UUID Generation**: uuid 13.0.0
- **Language**: TypeScript 5.9.2

### Backend
- **Framework**: Spring Boot 3.5.7
- **Build Tool**: Maven 3.9.11
- **Java Version**: 17
- **Serialization**: Jackson (JSON/XML)
- **CORS**: Configured for `localhost:4200`

## 📡 API Endpoints

### Drawing Operations
- `POST /drawing/add` - Add new shape
- `PUT /drawing/update` - Update existing shape
- `DELETE /drawing/delete/{id}` - Delete shape by ID
- `GET /drawing/all` - Get all shapes
- `DELETE /drawing/clear` - Clear canvas
- `POST /drawing/duplicate/{id}` - Duplicate shape

### History Management
- `POST /drawing/save-state` - Save current state
- `POST /drawing/undo` - Undo last action
- `POST /drawing/redo` - Redo last undone action
- `GET /drawing/can-undo` - Check if undo available
- `GET /drawing/can-redo` - Check if redo available

### File Operations
- `GET /export/json` - Export as JSON
- `GET /export/xml` - Export as XML
- `POST /import/json` - Import from JSON
- `POST /import/xml` - Import from XML

📁 Project Structure
paint-application/
├── assets/                           # Project documentation assets
│   ├── uml/                         # UML diagrams
│   │   ├── class-diagram.png
│   │   ├── add-shape-sequence.png
│   │   ├── undo-sequence.png
│   │   └── import-json-sequence.png
│   ├── report/                      # Project documentation
│   │   └── project-report.pdf
│   └── ui/                          # UI screenshots
│       ├── main-application.png
│       ├── properties-panel.png
│       ├── header-toolbar.png
│       ├── side-toolbar.png
│       └── drawing-demo.png
├── Backend/                         # Spring Boot backend
│   └── demo/
│       ├── src/
│       ├── pom.xml
│       └── mvnw
├── Frontend/                        # Angular frontend
│   ├── src/
│   ├── package.json
│   └── angular.json
└── README.md

## 🤝 Contributing

### Team Members
- **[Jana Mohamed Rashed]**
- **[Ahmed Sherif Abd El-Moniem]**
- **[Mohamed Radwan]** 

### Development Workflow
1. Create a feature in seperate branch
2. Implement changes with tests
3. Submit pull request for review
4. Merge after approval

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Browser compatibility: Best performance on Chrome/Edge
- Large canvas exports may take time to process
- Freehand paths with many points can impact performance

## 🔮 Future Enhancements

- [ ] Layer management system
- [ ] Text tool with font customization
- [ ] Image import and manipulation
- [ ] Gradient fills
- [ ] Pattern fills
- [ ] Keyboard shortcuts
- [ ] Grid and snap-to-grid
- [ ] Export to PNG/SVG
- [ ] Collaborative editing


## 🙏 Acknowledgments

- Fabric.js team for the excellent canvas library
- Spring Boot community for comprehensive documentation
- Angular team for the robust framework

---

**Made with ❤️ by [Your Team Name]**
