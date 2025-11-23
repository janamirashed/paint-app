import { Component, signal, ViewChild, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertiesPanel } from './components/properties-panel/properties-panel';
import { Canvas } from './components/canvas/canvas';
import { HeaderToolbar } from './components/header-toolbar/header-toolbar';
import { SideToolbar } from './components/side-toolbar/side-toolbar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [PropertiesPanel, Canvas, HeaderToolbar, SideToolbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  @ViewChild(Canvas) canvas!: Canvas;

  protected readonly title = signal('Frontend');
  currentTool: string = 'freehand';
  currentProperties: { [key: string]: any } = {
    strokeWidth: 5,
    strokeColor: '#000000',
    fillColor: 'transparent',
    opacity: 1,
    lineStyle: 'solid'
  };

  clearCanvas() {
    if (this.canvas) {
      this.canvas.clearCanvas();
    }
  }

  constructor(private http: HttpClient) {}

  // ADD THIS METHOD
  ngOnInit() {
    this.loadShapes();
  }

  loadShapes() {
    this.http.get<any[]>('http://localhost:8080/drawing/all').subscribe({
      next: (shapes) => {
        console.log('Loaded shapes:', shapes);
        setTimeout(() => {
          if (this.canvas && shapes.length > 0) {
            this.canvas.loadShapes(shapes);
          }
        }, 100);
      },
      error: (err) => {
        console.error('Error loading shapes:', err);
      }
    });
  }

  onToolChange(tool: string) {
    this.currentTool = tool;
  }

  onPropertiesChange(properties: { [key: string]: any }) {
    this.currentProperties = { ...properties };
    if (this.canvas) {
      this.canvas.onPropertiesChanged(this.currentProperties);
    }
  }
}
