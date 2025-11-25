import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
import {HttpClient} from '@angular/common/http';
import { createFabricObjectService } from './create-fabric-object';
@Injectable({
  providedIn: 'root',
})
export class LoadShapes {

  constructor(private http : HttpClient , private CFO:createFabricObjectService){}
  private baseUrl = 'http://localhost:8080';

  loadShapesFromBackend(canvas : fabric.Canvas) {
    this.http.get<any[]>(`${this.baseUrl}/drawing/all`).subscribe({
      next: (shapes) => {
        console.log('Loaded shapes from backend:', shapes);
        canvas.clear();

        shapes.forEach(shapeDTO => {
          try {
            // Convert ShapeDTO to Fabric.js object
            const fabricObj = this.CFO.createFabricObjectFromDTO(shapeDTO);
            if (fabricObj) {
              canvas.add(fabricObj);
            }
          } catch (error) {
            console.error('Error creating shape from DTO:', error, shapeDTO);
          }
        });

        canvas.renderAll();
      },
      error: (err) => console.error('Error loading shapes:', err)
    });
  }


  loadCanvasFromJSON(canvas : fabric.Canvas ,jsonString: string) {
    try {
      canvas.loadFromJSON(jsonString, () => {
        canvas.renderAll();
        console.log('Canvas loaded from JSON');
      });
    } catch (error) {
      console.error('Error loading canvas from JSON:', error);
    }
  }
}
