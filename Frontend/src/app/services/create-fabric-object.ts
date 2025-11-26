import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
@Injectable({
  providedIn: 'root',
})
export class createFabricObjectService {
  public createFabricObjectFromDTO(dto: any): fabric.Object | null {
    const props = dto.properties || {};
    const baseProps = {
      stroke: props.strokeColor || '#000000',
      strokeWidth: props.strokeWidth || 2,
      fill: props.fillColor || 'transparent',
      opacity: props.opacity || 1,
      angle: dto.angle || 0,
      scaleX: dto.scaleX || 1,
      scaleY: dto.scaleY || 1,
      left: props.left || dto.x1,
      top: props.top || dto.y1,
      selectable: true,
      id: dto.id,
      evented: true
    };

    let obj: fabric.Object | null = null;

    switch(dto.type.toLowerCase()) {
      case 'rectangle':
      case 'square':
        obj = new fabric.Rect({
          ...baseProps,
          width: props.width,
          height: props.height
        });
        break;

      case 'circle':
        obj = new fabric.Circle({
          ...baseProps,
          radius: props.radius,
          originX: 'center',
          originY: 'center'
        });
        break;

      case 'ellipse':
        obj = new fabric.Ellipse({
          ...baseProps,
          rx: props.rx,
          ry: props.ry,
          originX: 'center',
          originY: 'center'
        });
        break;

      case 'line':
        obj = new fabric.Line(
          [dto.x1, dto.y1, dto.x2, dto.y2],
          {
            ...baseProps,
            fill: undefined
          }
        );
        break;

      case 'triangle':
        obj = new fabric.Triangle({
          ...baseProps,
          width: props.width,
          height: props.height
        });
        break;

      case 'freehand':
      case 'path':
        if (props.path) {
          const pathString = typeof props.path === 'string'
            ? props.path
            : props.path.join(' ');

          obj = new fabric.Path(pathString, {
            ...baseProps,
            fill: undefined
          });
        }
        break;
    }

    return obj;
  }
}
