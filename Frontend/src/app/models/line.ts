import { Shape } from './shape';

export class Line extends Shape {
  constructor(x1: number, y1: number, x2: number, y2: number, properties: { [key: string]: any } = {}) {
    const props = {
      strokeColor: properties['strokeColor'] ?? '#000000',
      opacity: properties['opacity'] ?? 1,
      strokeWidth: properties['strokeWidth'] ?? 2,
      lineStyle: properties['lineStyle'] ?? 'solid',
      ...properties
    };
    super('line', x1, y1, x2, y2, props);
  }
}
