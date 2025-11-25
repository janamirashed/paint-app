import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class DrawService {
  startSquare(
    canvas: fabric.Canvas,
    drawingObject: fabric.Object | null,
    startX: number,
    startY: number,
    currentProperties: any
  ) {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    return new fabric.Rect({
      left: startX,
      top: startY,
      width: 1,
      height: 1,
      stroke: currentProperties.strokeColor,
      strokeWidth: currentProperties.strokeWidth,
      fill: currentProperties.fillColor,
      opacity: currentProperties.opacity,
      selectable: false,
      evented: false,
    });
  }

  startRectangle(
    canvas: fabric.Canvas,
    drawingObject: fabric.Object | null,
    startX: number,
    startY: number,
    currentProperties: any
  ) {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    return new fabric.Rect({
      left: startX,
      top: startY,
      width: 1,
      height: 1,
      stroke: currentProperties.strokeColor,
      strokeWidth: currentProperties.strokeWidth,
      fill: currentProperties.fillColor,
      opacity: currentProperties.opacity,
      selectable: false,
      evented: false,
    });
  }

  startEllipse(
    canvas: fabric.Canvas,
    drawingObject: fabric.Object | null,
    startX: number,
    startY: number,
    currentProperties: any
  ) {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    return new fabric.Ellipse({
      left: startX,
      top: startY,
      rx: 1,
      ry: 1,
      stroke: currentProperties.strokeColor,
      strokeWidth: currentProperties.strokeWidth,
      fill: currentProperties.fillColor,
      opacity: currentProperties.opacity,
      selectable: false,
      evented: false,
    });
  }

  startCircle(
    canvas: fabric.Canvas,
    drawingObject: fabric.Object | null,
    startX: number,
    startY: number,
    currentProperties: any
  ) {
    canvas.isDrawingMode = false;
    canvas.selection = false;

    return new fabric.Circle({
      left: startX,
      top: startY,
      radius: 1,
      stroke: currentProperties.strokeColor,
      strokeWidth: currentProperties.strokeWidth,
      fill: currentProperties.fillColor,
      opacity: currentProperties.opacity,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center',
    });
  }

   startTriangle(
    canvas: fabric.Canvas,
    drawingObject: fabric.Object | null,
    startX: number,
    startY: number,
    currentProperties: any
   ) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
  
      return new fabric.Triangle({
        left: startX,
        top: startY,
        width: 1,
        height: 1,
        stroke: currentProperties.strokeColor,
        strokeWidth: currentProperties.strokeWidth,
        fill: currentProperties.fillColor,
        opacity: currentProperties.opacity,
        selectable: false,
        evented: false
      });
      
    }
  
}
