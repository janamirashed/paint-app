import { Injectable } from '@angular/core';
import * as fabric from 'fabric';
import {HttpClient} from '@angular/common/http';
import { UpdateShape } from './update-shape';
@Injectable({
  providedIn: 'root',
})
export class Delete {

  constructor(private http : HttpClient , private update : UpdateShape){}
  private baseUrl = 'http://localhost:8080';

  


   
}
