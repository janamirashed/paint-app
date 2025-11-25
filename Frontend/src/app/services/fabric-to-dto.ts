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

    const left = fabricObj.left || 0;
    const top = fabricObj.top || 0;
    let x2 = left;
    let y2 = top;

    if (fabricObj.type === 'rect') {
      const rect = fabricObj as fabric.Rect;
      x2 = left + (rect.width || 0);
      y2 = top + (rect.height || 0);
    } else if (fabricObj.type === 'circle') {
      const circle = fabricObj as fabric.Circle;
      const radius = circle.radius || 0;
      x2 = left + radius * 2;
      y2 = top + radius * 2;
    } else if (fabricObj.type === 'ellipse') {
      const ellipse = fabricObj as fabric.Ellipse;
      x2 = left + (ellipse.rx || 0) * 2;
      y2 = top + (ellipse.ry || 0) * 2;
    } else if (fabricObj.type === 'line') {
      const line = fabricObj as fabric.Line;
      x2 = line.x2 || 0;
      y2 = line.y2 || 0;
    } else {
      const bounds = fabricObj.getBoundingRect();
      x2 = bounds.left + bounds.width;
      y2 = bounds.top + bounds.height;
    }

    const dto: ShapeDTO = {
      id : fabricObj.get('id'),
      type: type,
      x1: left,
      y1: top,
      x2: x2,
      y2: y2,
      angle: fabricObj.angle || 0,
      scaleX: fabricObj.scaleX || 1,
      scaleY: fabricObj.scaleY || 1,
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
      scaleY: obj.scaleY || 1,
      left: obj.left || 0,
      top: obj.top || 0
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
    }else if (obj.type === 'triangle') {
      const triangle = obj as fabric.Triangle;
      if (triangle.width !== undefined) {
        props['width'] = triangle.width;
      }
      if (triangle.height !== undefined) {
        props['height'] = triangle.height;
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
