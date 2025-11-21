import { Shape } from './shape';

export class Rectangle extends Shape {
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    properties: { [key: string]: any } = {}
  ) {
    super('rectangle', x1, y1, x2, y2, properties);
  }
}
