import { Injectable } from '@angular/core';
import { ShapeDTO } from '../dtos/ShapeDTO';
import * as fabric from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class FabricToDtoService {

  convertToDTO(fabricObj: fabric.Object): ShapeDTO | null {
    if (!fabricObj) return null;

    const type = this.getFabricType(fabricObj);
    const bounds = fabricObj.getBoundingRect();

    const dto: ShapeDTO = {
      id : fabricObj.get('id'),
      type: type,
      x1: bounds.left,
      y1: bounds.top,
      x2: bounds.left + bounds.width,
      y2: bounds.top + bounds.height,
      properties: this.extractProperties(fabricObj)
    };

    return dto;
  }

  private getFabricType(obj: fabric.Object): string {
    switch (obj.type) {
      case 'rect':
        const rect = obj as fabric.Rect;
        const width = rect.width || 0;
        const height = rect.height || 0;
        return (width === height) ? 'square' : 'rectangle';
      case 'circle':
        return 'circle';
      case 'ellipse':
        return 'ellipse';
      case 'line':
        return 'line';
      case 'triangle':
        return 'triangle';
      case 'path':
        return 'freehand';
      default:
        return obj.type || 'unknown';
    }
  }

  private extractProperties(obj: fabric.Object): { [key: string]: any } {
    const props: { [key: string]: any } = {
      strokeColor: obj.stroke || '#000000',
      strokeWidth: obj.strokeWidth || 1,
      fillColor: (obj.fill && obj.fill !== 'transparent') ? obj.fill : 'transparent',
      opacity: obj.opacity || 1,
      angle: obj.angle || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1
    };

    // Add shape-specific properties with type checking
    if (obj.type === 'circle') {
      const circle = obj as fabric.Circle;
      if (circle.radius !== undefined) {
        props['radius'] = circle.radius;
      }
    } else if (obj.type === 'ellipse') {
      const ellipse = obj as fabric.Ellipse;
      if (ellipse.rx !== undefined) {
        props['rx'] = ellipse.rx;
      }
      if (ellipse.ry !== undefined) {
        props['ry'] = ellipse.ry;
      }
    } else if (obj.type === 'rect') {
      const rect = obj as fabric.Rect;
      if (rect.width !== undefined) {
        props['width'] = rect.width;
      }
      if (rect.height !== undefined) {
        props['height'] = rect.height;
      }
    } else if (obj.type === 'path') {
      const path = obj as fabric.Path;
      if (path.path !== undefined) {
        props['path'] = path.path;
      }
    }

    return props;
  }
}
