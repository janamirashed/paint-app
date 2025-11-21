import { Component, ViewChild, ElementRef, AfterViewInit, Input, input } from '@angular/core';
import { ShapeFactory } from '../../services/shape-factory';
import { Shape } from '../../models/shape';

@Component({
  selector: 'app-canvas',
  imports: [],
  templateUrl: './canvas.html',
  styleUrl: './canvas.css',
})
export class Canvas implements AfterViewInit {
  ctx!: CanvasRenderingContext2D;
  drawing = false;
  
  currentShape: Shape | null = null;
  shapeRegister: Shape[] = [];

  // Default
  canvasWidth = 800;
  canvasHeight = 500;
  startX = 0;
  startY = 0;
  properties = {
    strokeWidth: 5,
    strokeColor: '#000000',
    fillColor: 'transparent',
    opacity: 1,
    lineStyle: 'solid',
  };

  @Input() activeTool: string = 'freehand';
  @Input() currentProperties: any = this.properties;

 

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
   

    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = 'black';
   
  }

  onMouseDown(event: MouseEvent) {
    this.drawing = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;

    
    this.currentShape = ShapeFactory.createShape(
      this.activeTool,
      this.startX,
      this.startY,
      this.startX,
      this.startY,
      this.properties = { 
      ...this.currentShape?.properties, 
      ...this.currentProperties   // append to the old properties (like points in freehand)
    
     }
    );

   
    if (this.activeTool === 'freehand') {
      if (!this.currentShape.properties) {
        this.currentShape.properties = {};
      }
      this.currentShape.properties['points'] = [{ x: this.startX, y: this.startY }];

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

      // Add shape to register
      this.shapeRegister.push(this.currentShape);
      this.currentShape = null;

      // Redraw canvas including new shape
      this.redrawAllShapes();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.drawing || !this.currentShape) return;

    const x = event.offsetX;
    const y = event.offsetY;

    if (this.activeTool === 'freehand') {
      
      if ('addPoint' in this.currentShape && typeof this.currentShape.addPoint === 'function') {
        (this.currentShape as any).addPoint(x, y);
      } else {
        
        if (!this.currentShape.properties['points']) {
          this.currentShape.properties['points'] = [];
        }
        this.currentShape.properties['points'].push({ x, y });
      }

      
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    } else {
  
      this.currentShape.x2 = x;
      this.currentShape.y2 = y;

      this.redrawAllShapes();
      this.drawShape(this.currentShape);
    }
  }

  drawShape(shape: Shape) {
    const { type, x1, y1, x2, y2, properties } = shape;
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    this.ctx.beginPath();

    switch (type) {
      case 'rectangle':
        this.ctx.strokeRect(x1, y1, width, height);
        break;

      case 'circle': {
        const radius = Math.sqrt(width * width + height * height);
        this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        break;
      }

      case 'ellipse': {
        const radiusX = Math.abs(width) / 2;
        const radiusY = Math.abs(height) / 2;
        const centerX = x1 + width / 2;
        const centerY = y1 + height / 2;
        this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        break;
      }

      case 'line':
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        break;

      case 'triangle':
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x1, y2);
        this.ctx.closePath();
        this.ctx.stroke();
        break;

      case 'freehand':
        // Draw freehand path from  points
        const points: { x: number; y: number }[] = properties?.['points'] || [];
        if (points.length === 0) return;

        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.stroke();
        break;

      default:
        console.warn('Unknown shape type:', type);
        break;
    }
  }

  redrawAllShapes() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.shapeRegister.forEach((s) => {
      this.drawShape(s);
    });
  }

  clearCanvas() {
    // Clear 
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // empty register
    this.shapeRegister = []

    this.currentShape = null;
    this.drawing = false;
  }
}
