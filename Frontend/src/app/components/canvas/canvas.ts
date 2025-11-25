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
import { v4 as uuidv4 } from 'uuid';
import {ShapeDTO} from '../../dtos/ShapeDTO';
import { createFabricObjectService  } from '../../services/create-fabric-object';
import { CanvasStatesService } from '../../services/canvas-states';
import { DrawService } from '../../services/draw';
import { UpdateShape } from '../../services/update-shape';
import { LoadShapes } from '../../services/load-shapes';
import { Delete } from '../../services/delete';
@Component({
  selector: 'app-canvas',
  standalone: true,
  templateUrl: './canvas.html',
  styleUrl: './canvas.css'
})
export class Canvas implements AfterViewInit, OnChanges {
  static canvas(canvas: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('fabricCanvas', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;

  @Input() activeTool: string = 'select';

  @Input() currentProperties: any = {
    strokeWidth: 3,
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
    private fabricToDtoService: FabricToDtoService,
    private CFO : createFabricObjectService,
    private canvasStates : CanvasStatesService,
    private draw : DrawService,
    private update : UpdateShape,
    private load :LoadShapes,
    private deleteService : Delete,
  ){}
  private isUndoRedoOperation = false;

  undo() {
    this.http.post<any[]>(`${this.baseUrl}/drawing/undo`, {}).subscribe({
      next: (shapes) => {
        this.isUndoRedoOperation = true;
        this.canvasStates.reloadCanvas(this.canvas , shapes);
        this.isUndoRedoOperation = false;
      },
      error: (err) => console.error('Undo failed:', err)
    });
  }
  redo() {
    this.http.post<any[]>(`${this.baseUrl}/drawing/redo`, {}).subscribe({
      next: (shapes) => {
        this.isUndoRedoOperation = true;
        this.canvasStates.reloadCanvas(this.canvas , shapes);
        this.isUndoRedoOperation = false;
      },
      error: (err) => console.error('Redo failed:', err)
    });
  }

  ////////////
deleteSelected() {
      const objs = this.canvas.getActiveObjects();
  
      if (!objs || objs.length === 0) return;
      this.update.saveStateToBackend(this.isUndoRedoOperation);
  
      objs.forEach((obj: fabric.Object) => {
        console.log('Deleting: '+obj.get('id'));
        this.deleteShapeInBackend(obj);
        this.canvas.remove(obj);
      });
  
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
    }

   public deleteShapeInBackend(fabricObj: fabric.Object) {
    const id = fabricObj.get('id');
    if(!id) return;

    this.http.delete(`${this.baseUrl}/drawing/delete/${id}`, { responseType: 'text' })
      .subscribe({
        next: () => console.log(`Shape deleted (ID: ${id})`),
        error: err => console.error('Failed to delete:', err)
      });

  }
  

  duplicateSelected() {
    const selectedObjects = this.canvas.getActiveObjects();
    if (!selectedObjects || selectedObjects.length === 0) return;

    selectedObjects.forEach(active => {
      const id = active.get('id');
      if (!id) return;

      this.http.post<ShapeDTO>(`${this.baseUrl}/drawing/duplicate/${id}`, {})
        .subscribe({
          next: (dto) => {
            const newShape = this.CFO.createFabricObjectFromDTO(dto);
            if (!newShape) return console.error('Failed to convert DTO to fabric object');

            this.canvas.add(newShape);

            this.canvas.setActiveObject(newShape);
            this.canvas.requestRenderAll();
          },
          error: (err) => console.error('Duplication failed:', err)
        });
    });

    this.canvas.discardActiveObject();
  }
  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasElement.nativeElement, {
      selection: true
    });
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);

    this.attachFabricEvents();
    this.handleToolChange();
    this.load.loadShapesFromBackend(this.canvas);
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
        this.update.saveShapeInBackend(e.path);
      }
    });

    // Track object modifications (move, scale, rotate)
    this.canvas.on('object:modified', (e: any) => {
      if (e.target && !this.isUndoRedoOperation) {
        this.update.saveStateToBackend(this.isUndoRedoOperation);
        // Update the modified object in backend
        this.update.updateShapeInBackend(e.target);
      }
    });
    // Track selection changes for property updates
    this.canvas.on('selection:created', () => {
      // save state on select ( before user modifies )
      this.update.saveStateToBackend(this.isUndoRedoOperation);
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
      this.update.saveStateToBackend(this.isUndoRedoOperation);
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

      this.update.saveStateToBackend(this.isUndoRedoOperation);
    }
    if (this.activeTool === 'rectangle'){ 
      this.drawingObject = this.draw.startRectangle(this.canvas , this.drawingObject ,this.startX , this.startY , this.currentProperties);
      this.drawingObject.set('id', uuidv4());
      this.canvas.add(this.drawingObject);
    }
    else if (this.activeTool === 'ellipse'){ 
      this.drawingObject = this.draw.startEllipse(this.canvas , this.drawingObject ,this.startX , this.startY , this.currentProperties);
      this.drawingObject.set('id', uuidv4());
      this.canvas.add(this.drawingObject);
    }
    else if (this.activeTool === 'line') this.startLine(pointer);
    else if (this.activeTool === 'square'){
      this.drawingObject = this.draw.startSquare(this.canvas , this.drawingObject ,this.startX , this.startY , this.currentProperties);
      this.drawingObject.set('id', uuidv4());
      this.canvas.add(this.drawingObject);
    }
    else if (this.activeTool === 'circle'){ 
      this.drawingObject = this.draw.startCircle(this.canvas , this.drawingObject ,this.startX , this.startY , this.currentProperties);
      this.drawingObject.set('id', uuidv4());
          this.canvas.add(this.drawingObject);
    }
    else if (this.activeTool === 'triangle'){ 
      this.drawingObject = this.draw.startTriangle(this.canvas , this.drawingObject ,this.startX , this.startY , this.currentProperties);
      this.drawingObject.set('id', uuidv4());
      this.canvas.add(this.drawingObject);
    }
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
      this.update.saveShapeInBackend(this.drawingObject);
    }
    this.drawingObject = null;
    this.isDrawing = false;
  }
  // Get entire canvas as JSON (for file export)
  getCanvasAsJSON(): string {
    return JSON.stringify(this.canvas.toJSON());
  }

  // Clear canvas and backend
  clearCanvas() {
    this.update.saveStateToBackend(this.isUndoRedoOperation);
    this.canvas.clear();
    this.http.delete(`${this.baseUrl}/drawing/clear`,{responseType : 'text'}).subscribe({
      next: () => console.log('Canvas cleared'),
      error: (err) => console.error('Error clearing canvas:', err)
    });
  }
  // ================= RECTANGLE ==================
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
    this.drawingObject.set('id', uuidv4());
    this.canvas.add(this.drawingObject);
  }

  resizeLine(pointer: fabric.Point) {
    const line = this.drawingObject as fabric.Line;

    line.set({ x2: pointer.x, y2: pointer.y });
    this.canvas.renderAll();
  }

  // ================= SQUARE ==================
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
  // ================= PROPERTIES ==================

  applyPropertiesToSelectedObject() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;

    if (!this.isUndoRedoOperation) {
      this.update.saveStateToBackend(this.isUndoRedoOperation);
    }

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
    this.update.updateShapeInBackend(activeObject);
  }

}
