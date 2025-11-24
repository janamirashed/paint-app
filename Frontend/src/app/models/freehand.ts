import { Shape } from './shape';

export class Freehand extends Shape {
  constructor(x1: number, y1: number, x2: number, y2: number, properties: { [key: string]: any } = {}) {
    const props = {
      points: properties['points'] ?? [],
      strokeColor: properties['strokeColor'] ?? '#000000',
      opacity: properties['opacity'] ?? 1,
      strokeWidth: properties['strokeWidth'] ?? 2,
      lineStyle: properties['lineStyle'] ?? 'solid',
      ...properties
    };
    super('freehand', x1, y1, x2, y2, props);
  }

  addPoint(x: number, y: number) {
    if (!this.properties['points']) this.properties['points'] = [];
    this.properties['points'].push({ x, y });
  }
}
