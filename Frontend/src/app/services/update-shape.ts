import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
import {HttpClient} from '@angular/common/http';
import { FabricToDtoService } from './fabric-to-dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root',
})
export class UpdateShape {

  constructor(private http: HttpClient,private fabricToDtoService: FabricToDtoService){}
  private baseUrl = 'http://localhost:8080';

  public updateShapeInBackend(fabricObj: fabric.Object) {
    const shapeDTO = this.fabricToDtoService.convertToDTO(fabricObj);
    if (!shapeDTO) return console.error('Failed to convert fabric object to DTO');

    //debugging
    console.log(' SENDING UPDATE:', {
      id: shapeDTO.id,
      type: shapeDTO.type,
      bounds: { x1: shapeDTO.x1, y1: shapeDTO.y1, x2: shapeDTO.x2, y2: shapeDTO.y2 },
      properties: shapeDTO.properties,
      fabricObject: {
        left: fabricObj.left,
        top: fabricObj.top,
        scaleX: fabricObj.scaleX,
        scaleY: fabricObj.scaleY,
        angle: fabricObj.angle,
        width: (fabricObj as any).width,
        height: (fabricObj as any).height
      }

    });
    this.http.put(`${this.baseUrl}/drawing/update`, shapeDTO, { responseType: 'text' })
      .subscribe({
        next: (res) => console.log(`Shape updated in backend (ID: ${shapeDTO.id})`),
        error: (err) => console.error('Failed to update shape:', err)
      });
  }

  public saveShapeInBackend(fabricObj: fabric.Object) {
    if (!fabricObj.get('id')) {
      fabricObj.set('id', uuidv4());
    }

    const shapeDTO = this.fabricToDtoService.convertToDTO(fabricObj);
    if (!shapeDTO) return console.error('Failed to convert fabric object to DTO');

    this.http.post(`${this.baseUrl}/drawing/add`, shapeDTO, { responseType: 'text' })
      .subscribe({
        next: () => console.log(`Shape saved (ID: ${shapeDTO.id})`),
        error: (err) => console.error('Failed to save shape:', err)
      });
  }

  public saveStateToBackend(isUndoRedoOperation : boolean) {
    // Don't save state during undo/redo operations
    if (isUndoRedoOperation) return;

    this.http.post(`${this.baseUrl}/drawing/save-state`, {}, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          console.log('State saved:', res);
        },
        error: (err) => {
          // Only real HTTP errors will trigger this
          console.error('Failed to save state:', err);
        }
      });
  }
}
