import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
import { createFabricObjectService } from './create-fabric-object';
@Injectable({
  providedIn: 'root',
})
export class CanvasStatesService {
  constructor(private CFO: createFabricObjectService) {}

  public reloadCanvas(canvas: fabric.Canvas, shapes: any[]) {
    console.log(' RELOADING CANVAS with shapes:', shapes);
    canvas.clear();
    shapes.forEach((shapeDTO) => {
      try {
        console.log('🔄 Creating shape from DTO:', shapeDTO);
        const fabricObj = this.CFO.createFabricObjectFromDTO(shapeDTO);
        if (fabricObj) {
          fabricObj.set('id', shapeDTO.id);
          canvas.add(fabricObj);

          console.log(' Created fabric object:', {
            id: shapeDTO.id,
            type: fabricObj.type,
            left: fabricObj.left,
            top: fabricObj.top,
            scaleX: fabricObj.scaleX,
            scaleY: fabricObj.scaleY,
            angle: fabricObj.angle,
            width: (fabricObj as any).width,
            height: (fabricObj as any).height,
          });
        }
      } catch (error) {
        console.error('Error creating shape from DTO:', error, shapeDTO);
      }
    });
    canvas.renderAll();
  }



}
