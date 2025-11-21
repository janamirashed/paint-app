import { Shape } from './shape';

export class Square extends Shape {
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    properties: { [key: string]: any } = {}
  ) {
    super('square', x1, y1, x2, y2, properties);
  }
}
