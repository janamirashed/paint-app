import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as fabric from 'fabric';
import {HttpClient} from '@angular/common/http';
import { FabricToDtoService } from '../../services/fabric-to-dto';

@Component({
  selector: 'app-canvas',
  standalone: true,
  templateUrl: './canvas.html',
  styleUrl: './canvas.css'
})
export class Canvas implements AfterViewInit, OnChanges {
  @ViewChild('fabricCanvas', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;

  @Input() activeTool: string = 'select';

  @Input() currentProperties: any = {
    strokeWidth: 5,
    strokeColor: '#000000',
    fillColor: 'transparent',
    opacity: 1,
    lineStyle: 'solid'
  };

  canvas!: fabric.Canvas;

  startX = 0;
  startY = 0;

  drawingObject: fabric.Object | null = null;
  isDrawing = false;

  private baseUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private fabricToDtoService: FabricToDtoService
  ) {}

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      selection: true
    });

    // Initialize the free drawing brush
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);

    this.attachFabricEvents();

    // Apply initial tool state
    this.handleToolChange();

    // Load existing shapes from backend
    this.loadShapesFromBackend();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.canvas) return;

    // Handle tool changes - check both if it changed AND if it exists (for initial load)
    if (changes['activeTool']) {
      this.handleToolChange();
    }

    // Handle property changes for selected objects
    if (changes['currentProperties']) {
      this.applyPropertiesToSelectedObject();

      // Also update brush properties if in drawing mode
      if (this.canvas.isDrawingMode && this.canvas.freeDrawingBrush) {
        this.canvas.freeDrawingBrush.color = this.currentProperties.strokeColor;
        this.canvas.freeDrawingBrush.width = this.currentProperties.strokeWidth;
      }
    }
  }

  // ========================= EVENTS =========================

  attachFabricEvents() {
    this.canvas.on('mouse:down', (e) => this.handleMouseDown(e));
    this.canvas.on('mouse:move', (e) => this.handleMouseMove(e));
    this.canvas.on('mouse:up', () => this.handleMouseUp());

    // Listen for when free drawing path is created
    this.canvas.on('path:created', (e: any) => {
      if (e.path) {
        this.saveShapeToBackend(e.path);
      }
    });
  }

  // ========================= TOOL MANAGEMENT =========================

  handleToolChange() {
    // Deselect any active objects when switching tools
    this.canvas.discardActiveObject();
    this.canvas.renderAll();

    // Reset drawing mode and selection based on active tool
    if (this.activeTool === 'select') {
      this.canvas.isDrawingMode = false;
      this.canvas.selection = true;
      this.canvas.defaultCursor = 'default';
    } else if (this.activeTool === 'pencil' || this.activeTool === 'freehand') {
      this.canvas.selection = false;
      this.canvas.defaultCursor = 'crosshair';
      this.canvas.isDrawingMode = true;

      // Configure brush - make sure it exists
      if (this.canvas.freeDrawingBrush) {
        this.canvas.freeDrawingBrush.color = this.currentProperties.strokeColor;
        this.canvas.freeDrawingBrush.width = this.currentProperties.strokeWidth;
      }
    } else {
      // For shape tools (rectangle, ellipse, line, square, circle, triangle)
      this.canvas.isDrawingMode = false;
      this.canvas.selection = false;
      this.canvas.defaultCursor = 'crosshair';
    }
  }

  // ========================= LOGIC ==========================

  handleMouseDown(e: fabric.TEvent) {
    // For freehand/pencil, let fabric handle it
    if (this.activeTool === 'pencil' || this.activeTool === 'freehand') {
      return;
    }

    const pointer = this.canvas.getPointer(e.e);
    this.startX = pointer.x;
    this.startY = pointer.y;
    this.isDrawing = true;

    // Disable selection while drawing any shape
    if (this.activeTool !== 'select') {
      this.canvas.selection = false;
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }

    if (this.activeTool === 'rectangle') this.startRectangle();
    else if (this.activeTool === 'ellipse') this.startEllipse();
    else if (this.activeTool === 'line') this.startLine(pointer);
    else if (this.activeTool === 'square') this.startSquare();
    else if (this.activeTool === 'circle') this.startCircle();
    else if (this.activeTool === 'triangle') this.startTriangle();
    else if (this.activeTool === 'select') {
      // Ensure we're not in drawing mode for select tool
      this.canvas.isDrawingMode = false;
      this.canvas.selection = true;
    }
  }

  handleMouseMove(e: fabric.TEvent) {
    if (!this.isDrawing || !this.drawingObject) return;

    const pointer = this.canvas.getPointer(e.e);

    if (this.activeTool === 'rectangle') this.resizeRectangle(pointer);
    else if (this.activeTool === 'ellipse') this.resizeEllipse(pointer);
    else if (this.activeTool === 'line') this.resizeLine(pointer);
    else if (this.activeTool === 'square') this.resizeSquare(pointer);
    else if (this.activeTool === 'circle') this.resizeCircle(pointer);
    else if (this.activeTool === 'triangle') this.resizeTriangle(pointer);
  }

  handleMouseUp() {
    // Make the drawn object selectable and evented after it's finished
    if (this.drawingObject) {
      this.drawingObject.set({
        selectable: true,
        evented: true
      });

      // Save the shape to backend
      this.saveShapeToBackend(this.drawingObject);
    }

    this.drawingObject = null;
    this.isDrawing = false;
  }

  // ================= SAVE/LOAD FABRIC JSON ==================

  private saveShapeToBackend(fabricObj: fabric.Object) {
    const shapeDTO = this.fabricToDtoService.convertToDTO(fabricObj);

    if (!shapeDTO) {
      console.error('Failed to convert fabric object to DTO');
      return;
    }

    this.http.post(`${this.baseUrl}/drawing/add`, shapeDTO).subscribe({
      next: () => console.log('Shape saved to backend via Factory'),
      error: (err) => console.error('Failed to save shape:', err)
    });
  }

  loadShapesFromBackend() {
    this.http.get<any[]>(`${this.baseUrl}/drawing/all`).subscribe({
      next: (shapes) => {
        console.log('Loaded shapes from backend:', shapes);
        this.canvas.clear();

        shapes.forEach(shapeDTO => {
          try {
            // Convert ShapeDTO to Fabric.js object
            const fabricObj = this.createFabricObjectFromDTO(shapeDTO);
            if (fabricObj) {
              this.canvas.add(fabricObj);
            }
          } catch (error) {
            console.error('Error creating shape from DTO:', error, shapeDTO);
          }
        });

        this.canvas.renderAll();
      },
      error: (err) => console.error('Error loading shapes:', err)
    });
  }

// convert ShapeDTO back to Fabric.js objects
  private createFabricObjectFromDTO(dto: any): fabric.Object | null {
    const props = dto.properties || {};

    const commonProps = {
      stroke: props.strokeColor || '#000000',
      strokeWidth: props.strokeWidth || 2,
      fill: props.fillColor || 'transparent',
      opacity: props.opacity || 1,
      angle: dto.angle || 0,
      scaleX: dto.scaleX || 1,
      scaleY: dto.scaleY || 1,
      selectable: true,
      evented: true
    };

    let obj: fabric.Object | null = null;

    switch(dto.type.toLowerCase()) {
      case 'rectangle':
      case 'square':
        const width = Math.abs(dto.x2 - dto.x1);
        const height = Math.abs(dto.y2 - dto.y1);
        obj = new fabric.Rect({
          left: Math.min(dto.x1, dto.x2),
          top: Math.min(dto.y1, dto.y2),
          width: props.width || width,
          height: props.height || height,
          ...commonProps
        });
        break;

      case 'circle':
        const radius = props.radius || Math.abs(dto.x2 - dto.x1) / 2;
        obj = new fabric.Circle({
          left: dto.x1,
          top: dto.y1,
          radius: radius,
          originX: 'center',
          originY: 'center',
          ...commonProps
        });
        break;

      case 'ellipse':
        obj = new fabric.Ellipse({
          left: dto.x1,
          top: dto.y1,
          rx: props.rx || Math.abs(dto.x2 - dto.x1) / 2,
          ry: props.ry || Math.abs(dto.y2 - dto.y1) / 2,
          originX: 'center',
          originY: 'center',
          ...commonProps
        });
        break;

      case 'line':
        obj = new fabric.Line(
          [dto.x1, dto.y1, dto.x2, dto.y2],
          {
            ...commonProps,
            fill: undefined // Lines don't have fill
          }
        );
        break;

      case 'triangle':
        const triWidth = Math.abs(dto.x2 - dto.x1);
        const triHeight = Math.abs(dto.y2 - dto.y1);
        obj = new fabric.Triangle({
          left: Math.min(dto.x1, dto.x2),
          top: Math.min(dto.y1, dto.y2),
          width: triWidth,
          height: triHeight,
          ...commonProps
        });
        break;

      case 'freehand':
      case 'path':
        if (props.path) {
          obj = new fabric.Path(props.path, {
            ...commonProps,
            fill: undefined // Freehand paths don't have fill
          });
        }
        break;
    }

    return obj;
  }
  // Load entire canvas from JSON (for file import)
  loadCanvasFromJSON(jsonString: string) {
    try {
      this.canvas.loadFromJSON(jsonString, () => {
        this.canvas.renderAll();
        console.log('Canvas loaded from JSON');
      });
    } catch (error) {
      console.error('Error loading canvas from JSON:', error);
    }
  }

  // Get entire canvas as JSON (for file export)
  getCanvasAsJSON(): string {
    return JSON.stringify(this.canvas.toJSON());
  }

  // Clear canvas and backend
  clearCanvas() {
    this.canvas.clear();
    this.http.delete(`${this.baseUrl}/drawing/clear`).subscribe({
      next: () => console.log('Canvas cleared'),
      error: (err) => console.error('Error clearing canvas:', err)
    });
  }

  // ================= RECTANGLE ==================

  startRectangle() {
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    this.drawingObject = new fabric.Rect({
      left: this.startX,
      top: this.startY,
      width: 1,
      height: 1,
      stroke: this.currentProperties.strokeColor,
      strokeWidth: this.currentProperties.strokeWidth,
      fill: this.currentProperties.fillColor,
      opacity: this.currentProperties.opacity,
      selectable: false,
      evented: false
    });

    this.canvas.add(this.drawingObject);
  }

  resizeRectangle(pointer: fabric.Point) {
    const rect = this.drawingObject as fabric.Rect;

    rect.set({
      width: Math.abs(pointer.x - this.startX),
      height: Math.abs(pointer.y - this.startY),
      left: Math.min(this.startX, pointer.x),
      top: Math.min(this.startY, pointer.y)
    });

    this.canvas.renderAll();
  }

  // ================= ELLIPSE ==================

  startEllipse() {
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    this.drawingObject = new fabric.Ellipse({
      left: this.startX,
      top: this.startY,
      rx: 1,
      ry: 1,
      stroke: this.currentProperties.strokeColor,
      strokeWidth: this.currentProperties.strokeWidth,
      fill: this.currentProperties.fillColor,
      opacity: this.currentProperties.opacity,
      selectable: false,
      evented: false
    });

    this.canvas.add(this.drawingObject);
  }

  resizeEllipse(pointer: fabric.Point) {
    const ellipse = this.drawingObject as fabric.Ellipse;

    ellipse.set({
      rx: Math.abs(pointer.x - this.startX) / 2,
      ry: Math.abs(pointer.y - this.startY) / 2,
      left: Math.min(this.startX, pointer.x) + Math.abs(pointer.x - this.startX) / 2,
      top: Math.min(this.startY, pointer.y) + Math.abs(pointer.y - this.startY) / 2,
      originX: 'center',
      originY: 'center'
    });

    this.canvas.renderAll();
  }

  // ================= LINE ==================

  startLine(pointer: fabric.Point) {
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    const points: [number, number, number, number] = [
      this.startX,
      this.startY,
      pointer.x,
      pointer.y
    ];

    this.drawingObject = new fabric.Line(points, {
      stroke: this.currentProperties.strokeColor,
      strokeWidth: this.currentProperties.strokeWidth,
      opacity: this.currentProperties.opacity,
      selectable: false,
      evented: false
    });

    this.canvas.add(this.drawingObject);
  }

  resizeLine(pointer: fabric.Point) {
    const line = this.drawingObject as fabric.Line;

    line.set({ x2: pointer.x, y2: pointer.y });
    this.canvas.renderAll();
  }

  // ================= SQUARE ==================

  startSquare() {
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    this.drawingObject = new fabric.Rect({
      left: this.startX,
      top: this.startY,
      width: 1,
      height: 1,
      stroke: this.currentProperties.strokeColor,
      strokeWidth: this.currentProperties.strokeWidth,
      fill: this.currentProperties.fillColor,
      opacity: this.currentProperties.opacity,
      selectable: false,
      evented: false
    });

    this.canvas.add(this.drawingObject);
  }

  resizeSquare(pointer: fabric.Point) {
    const square = this.drawingObject as fabric.Rect;

    // Calculate size based on the larger dimension to create a square
    const deltaX = Math.abs(pointer.x - this.startX);
    const deltaY = Math.abs(pointer.y - this.startY);
    const size = Math.max(deltaX, deltaY);

    // Determine direction for positioning
    const dirX = pointer.x >= this.startX ? 1 : -1;
    const dirY = pointer.y >= this.startY ? 1 : -1;

    square.set({
      width: size,
      height: size,
      left: dirX === 1 ? this.startX : this.startX - size,
      top: dirY === 1 ? this.startY : this.startY - size
    });

    this.canvas.renderAll();
  }

  // ================= CIRCLE ==================

  startCircle() {
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    this.drawingObject = new fabric.Circle({
      left: this.startX,
      top: this.startY,
      radius: 1,
      stroke: this.currentProperties.strokeColor,
      strokeWidth: this.currentProperties.strokeWidth,
      fill: this.currentProperties.fillColor,
      opacity: this.currentProperties.opacity,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    });

    this.canvas.add(this.drawingObject);
  }

  resizeCircle(pointer: fabric.Point) {
    const circle = this.drawingObject as fabric.Circle;

    // Calculate radius based on the distance from start point
    const deltaX = Math.abs(pointer.x - this.startX);
    const deltaY = Math.abs(pointer.y - this.startY);
    const radius = Math.max(deltaX, deltaY) / 2;

    // Center the circle between start and current pointer
    const centerX = (this.startX + pointer.x) / 2;
    const centerY = (this.startY + pointer.y) / 2;

    circle.set({
      radius: radius,
      left: centerX,
      top: centerY
    });

    this.canvas.renderAll();
  }

  // ================= TRIANGLE ==================

  startTriangle() {
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;

    this.drawingObject = new fabric.Triangle({
      left: this.startX,
      top: this.startY,
      width: 1,
      height: 1,
      stroke: this.currentProperties.strokeColor,
      strokeWidth: this.currentProperties.strokeWidth,
      fill: this.currentProperties.fillColor,
      opacity: this.currentProperties.opacity,
      selectable: false,
      evented: false
    });

    this.canvas.add(this.drawingObject);
  }

  resizeTriangle(pointer: fabric.Point) {
    const triangle = this.drawingObject as fabric.Triangle;

    const width = Math.abs(pointer.x - this.startX);
    const height = Math.abs(pointer.y - this.startY);

    triangle.set({
      width: width,
      height: height,
      left: Math.min(this.startX, pointer.x),
      top: Math.min(this.startY, pointer.y)
    });

    this.canvas.renderAll();
  }

  // ================= PENCIL ==================

  /* enableFreeDrawing() {
    this.canvas.isDrawingMode = true;
    this.canvas.selection = false;
    this.canvas.discardActiveObject();

    if (this.canvas.freeDrawingBrush) {
      this.canvas.freeDrawingBrush.color = this.currentProperties.strokeColor;
      this.canvas.freeDrawingBrush.width = this.currentProperties.strokeWidth;
    }
  } */

  // ================= PROPERTIES ==================

  applyPropertiesToSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    const updates: any = {};

    // Apply stroke width
    if (this.currentProperties.strokeWidth !== undefined) {
      updates.strokeWidth = this.currentProperties.strokeWidth;
    }

    // Apply stroke color
    if (this.currentProperties.strokeColor !== undefined) {
      updates.stroke = this.currentProperties.strokeColor;
    }

    // Apply fill color (only if the object supports fill)
    if (this.currentProperties.fillColor !== undefined && activeObject.type !== 'line') {
      updates.fill = this.currentProperties.fillColor;
    }

    // Apply opacity
    if (this.currentProperties.opacity !== undefined) {
      updates.opacity = this.currentProperties.opacity;
    }

    activeObject.set(updates);
    this.canvas.renderAll();
  }
}
