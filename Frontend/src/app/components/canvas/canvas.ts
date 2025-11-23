import { Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ShapeFactoryService } from '../../services/shape-factory';
import { Shape } from '../../models/shape';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.html',
  styleUrls: ['./canvas.css'],
})
export class Canvas implements AfterViewInit {

  constructor(private shapeFactory: ShapeFactoryService) {}

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() shapeSelected = new EventEmitter<Shape>();
  @Input() activeTool: string = 'freehand';
  @Input() currentProperties: { [key: string]: any } = {
    strokeWidth: 5,
    strokeColor: '#000000',
    fillColor: 'transparent',
    opacity: 1,
    lineStyle: 'solid'
  };

  ctx!: CanvasRenderingContext2D;
  drawing = false;

  currentShape: Shape | null = null;
  shapeRegister: Shape[] = [];

  canvasWidth = 800;
  canvasHeight = 500;
  startX = 0;
  startY = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = 'black';
  }

  onPropertiesChanged(newProps: any) {
    this.currentProperties = { ...newProps };
    console.log('Properties updated in canvas:', this.currentProperties);
  }

  onMouseDown(event: MouseEvent) {
    this.drawing = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;

    // Create shape using injected service
    this.currentShape = this.shapeFactory.createShape(
      this.activeTool,
      this.startX,
      this.startY,
      this.startX,
      this.startY,
      { ...this.currentProperties }
    );

    if (this.activeTool === 'freehand') {

      if (!this.currentShape.properties['points']) {
        this.currentShape.properties['points'] = [];
      }

      this.currentShape.properties['points'].push({ x: this.startX, y: this.startY });

      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (!this.drawing) return;
    this.drawing = false;

    const x = event.offsetX;
    const y = event.offsetY;

    if (this.currentShape) {
      this.currentShape.x2 = x;
      this.currentShape.y2 = y;

      this.shapeRegister.push(this.currentShape);
      this.shapeSelected.emit(this.currentShape);
      this.currentShape = null;

      this.redrawAllShapes();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.drawing) return;
    const x = event.offsetX;
    const y = event.offsetY;

    if (!this.currentShape) return;

    if (this.activeTool === 'freehand') {

      if (!this.currentShape.properties['points']) {
        this.currentShape.properties['points'] = [];
      }

      this.currentShape.properties['points'].push({ x, y });

      this.ctx.lineTo(x, y);
      this.applyDrawingStyle(this.currentShape);
      this.ctx.stroke();

    } else {
      this.currentShape.x2 = x;
      this.currentShape.y2 = y;

      this.redrawAllShapes();
      this.drawShape(this.currentShape);
    }
  }

  applyDrawingStyle(shape: Shape) {
    const props = shape.properties || {};
    this.ctx.lineWidth = props['strokeWidth'] ?? 1;
    this.ctx.strokeStyle = props['strokeColor'] ?? '#000';
    this.ctx.fillStyle = props['fillColor'] ?? 'transparent';
    this.ctx.globalAlpha = props['opacity'] ?? 1;

    if (props['lineStyle'] === 'dashed') {
      this.ctx.setLineDash([10, 5]);
    } else {
      this.ctx.setLineDash([]);
    }
  }

  drawShape(shape: Shape) {
    const { type, x1, y1, x2, y2, properties } = shape;
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    this.ctx.beginPath();
    this.applyDrawingStyle(shape);

    const drawX = x2 >= x1 ? x1 : x1 - width;
    const drawY = y2 >= y1 ? y1 : y1 - height;

    switch (type) {
      case 'square': {
        const side = Math.min(width, height);
        const sx = x2 >= x1 ? x1 : x1 - side;
        const sy = y2 >= y1 ? y1 : y1 - side;
        if (this.ctx.fillStyle !== 'transparent') this.ctx.fillRect(sx, sy, side, side);
        this.ctx.strokeRect(sx, sy, side, side);
        break;
      }

      case 'rectangle':
        if (this.ctx.fillStyle !== 'transparent') this.ctx.fillRect(drawX, drawY, width, height);
        this.ctx.strokeRect(drawX, drawY, width, height);
        break;

      case 'circle': {
        const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        if (this.ctx.fillStyle !== 'transparent') this.ctx.fill();
        this.ctx.stroke();
        break;
      }

      case 'ellipse': {
        const radiusX = width / 2;
        const radiusY = height / 2;
        const centerX = drawX + radiusX;
        const centerY = drawY + radiusY;
        this.ctx.beginPath();
        if (typeof this.ctx.ellipse === 'function') {
          this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
          if (this.ctx.fillStyle !== 'transparent') this.ctx.fill();
          this.ctx.stroke();
        }
        break;
      }

      case 'line':
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        break;

      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y1);
        this.ctx.lineTo(drawX, y2);
        this.ctx.closePath();
        if (this.ctx.fillStyle !== 'transparent') this.ctx.fill();
        this.ctx.stroke();
        break;

      case 'freehand': {
        const points = properties?.['points'] || [];
        if (points.length === 0) return;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.stroke();
        break;
      }

      default:
        console.warn('Unknown shape type:', type);
        break;
    }

    this.ctx.globalAlpha = 1;
    this.ctx.setLineDash([]);
  }

  redrawAllShapes() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (const s of this.shapeRegister) {
      this.drawShape(s);
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.shapeRegister = [];
    this.currentShape = null;
    this.drawing = false;
  }
}
