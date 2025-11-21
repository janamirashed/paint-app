import { Shape } from "./shape";

export class Freehand extends Shape {
  points: { x: number; y: number }[] = [];

  constructor(x1: number, y1: number, x2: number, y2: number, properties: { [key: string]: any } = {}) {
    super('freehand', x1, y1, x2, y2, properties);
    
    this.points = [{ x: x1, y: y1 }];

    if (!this.properties['points']) {
      this.properties['points'] = this.points;
    }
  }

 
  addPoint(x: number, y: number): void {
    this.points.push({ x, y });
    this.properties['points'] = this.points;
    this.x2 = x;
    this.y2 = y;
  }

  
  getPoints(): { x: number; y: number }[] {
    return this.points;
  }

  
  override toJSON(): any {
    return {
      ...super.toJSON?.() || {},
      type: this.type,
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      points: this.points,
      properties: this.properties
    };
  }
}