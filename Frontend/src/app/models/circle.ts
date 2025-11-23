import { Shape } from './shape';

export class Circle extends Shape {
  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    properties: { [key: string]: any } = {}
  ) {
    super('circle', x1, y1, x2, y2, {
      strokeColor: properties['strokeColor'] ?? '#000000',
      fillColor: properties['fillColor'] ?? 'transparent',
      opacity: properties['opacity'] ?? 1,
      strokeWidth: properties['strokeWidth'] ?? 2,
      lineStyle: properties['lineStyle'] ?? 'solid',
      ...properties
    });
  }
}
