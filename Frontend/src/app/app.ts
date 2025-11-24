import { Component, signal, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertiesPanel } from './components/properties-panel/properties-panel';
import { Canvas } from './components/canvas/canvas';
import { HeaderToolbar } from './components/header-toolbar/header-toolbar';
import { SideToolbar } from './components/side-toolbar/side-toolbar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PropertiesPanel, Canvas, HeaderToolbar, SideToolbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App /* implements OnInit, AfterViewInit */ {
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

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    console.log('Canvas initialized:', this.canvas);
  }


  onToolChange(tool: string) {
    this.currentTool = tool;
  }

  onPropertiesChange(properties: { [key: string]: any }) {
    this.currentProperties = { ...properties };
  }

  onClearCanvas() {
    if (this.canvas) {
      this.canvas.clearCanvas();
    }
  }
}
