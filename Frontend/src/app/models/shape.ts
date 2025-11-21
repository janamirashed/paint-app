export abstract class Shape {
  type: string;
  x1: number;
  y1: number;
  x2: number
  y2: number;
  properties: { [key: string]: any };

  constructor(type: string, x1: number, y1: number,x2:number,y2:number, properties: { [key: string]: any } = {}) {
    this.type = type;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.properties = properties;
  }

    toJSON() {
    return {
      type: this.type,
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      properties: this.properties
    };
  }
}
