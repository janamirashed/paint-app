import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  

  exportJSON(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/json`, {
      responseType: 'blob'
    });
  }

  exportXML(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/export/xml`, {
      responseType: 'blob'
    });
  }

  importJSON(content: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.baseUrl}/import/json`, content, {
      headers,
      responseType: 'text'
    });
  }

  importXML(content: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/xml' });
    return this.http.post(`${this.baseUrl}/import/xml`, content, {
      headers,
      responseType: 'text'
    });
  }
}
