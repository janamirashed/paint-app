import { Shape } from './shape';

export class Circle extends Shape {
  radius: number;
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    properties: { [key: string]: any } = {}
  ) {
    super('circle', x1, y1, x2, y2, properties);
    this.radius = 0;
  }
}
