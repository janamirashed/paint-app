import { Injectable } from '@angular/core';
import { Circle } from '../models/circle';
import { Rectangle } from '../models/rectangle';
import { Line } from '../models/line';
import { Triangle } from '../models/triangle';
import { Freehand } from '../models/freehand';
import { Shape } from '../models/shape';
import { Ellipse } from '../models/ellipse';
import {Square} from '../models/square';
@Injectable({
  providedIn: 'root',
})
export class ShapeFactory {
  static createShape(type: string, x1: number, y1: number,x2:number,y2:number, properties: { [key: string]: any } = {}): Shape {
    switch (type) {
      case 'freehand':
        return new Freehand(x1, y1,x2,y2, properties);
      case 'line':
        return new Line(x1, y1,x2,y2, properties);
      case 'rectangle':
        return new Rectangle(x1, y1,x2,y2, properties);
      case 'circle':
        return new Circle(x1, y1,x2,y2, properties);
      case 'triangle':
        return new Triangle(x1, y1,x2,y2, properties);
      case 'ellipse':
        return new Ellipse(x1, y1,x2,y2, properties);
      case 'square':
        return new Square(x1, y1, x2, y2, properties);
      default:
        throw new Error('Unknown shape type: ' + type);
    }
  }
}
