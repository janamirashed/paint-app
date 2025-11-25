import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
@Injectable({
  providedIn: 'root',
})
export class createFabricObjectService {
  public createFabricObjectFromDTO(dto: any): fabric.Object | null {
    const props = dto.properties || {};
    const commonProps = {
      stroke: props.strokeColor || '#000000',
      strokeWidth: props.strokeWidth || 2,
      strokeDashArray: props.lineStyle === 'dashed' ? [10, 10] : [],
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
          width: props.width ||Math.abs(dto.x2 - dto.x1),
          height: props.height || Math.abs(dto.y2 - dto.y1),
          ...commonProps
        });
        break;

      case 'circle':
        const radius = props.radius || Math.abs(dto.x2 - dto.x1) / 2;
        obj = new fabric.Circle({
          radius: radius,
          originX: 'center',
          originY: 'center',
          ...commonProps
        });
        break;

      case 'ellipse':
        obj = new fabric.Ellipse({
          rx: props.rx || Math.abs(dto.x2 - dto.x1) / 2,
          ry: props.ry || Math.abs(dto.y2 - dto.y1) / 2,
          originX: 'center',
          originY: 'center',
          ...commonProps
        });
        break;

      case 'line':
        obj = new fabric.Line(
          [dto.x1, dto.y1, dto.x2, dto.y2],
          {
            ...commonProps,
            fill: undefined
          }
        );
        break;

      case 'triangle':
        const triWidth = Math.abs(dto.x2 - dto.x1);
        const triHeight = Math.abs(dto.y2 - dto.y1);
        obj = new fabric.Triangle({
          width: props.width || triWidth,
          height: props.height || triHeight,
          ...commonProps
        });
        break;

      case 'freehand':
      case 'path':
        if (props.path) {
          try {
            let pathString = '';

            if (typeof props.path === 'string') {
              pathString = props.path;
            } else if (Array.isArray(props.path)) {
              pathString = props.path.join(' ');
            }

            if (pathString) {
              obj = new fabric.Path(pathString, {
                ...commonProps,
                fill: undefined
              });
            }
          } catch (error) {
            console.error('Error creating path from DTO:', error, props.path);
          }
        }
        break;
    }

    return obj;
  }
}
