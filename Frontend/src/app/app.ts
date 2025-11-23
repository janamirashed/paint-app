import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertiesPanel } from './components/properties-panel/properties-panel';
import { Canvas } from './components/canvas/canvas';
import { HeaderToolbar } from './components/header-toolbar/header-toolbar';
import { SideToolbar } from './components/side-toolbar/side-toolbar';

@Component({
  selector: 'app-root',
  imports: [PropertiesPanel, Canvas, HeaderToolbar, SideToolbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
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

  onToolChange(tool: string) {
    this.currentTool = tool;
  }

  // onPropertiesChange(properties: { [key: string]: any }) {
  //   this.currentProperties = { ...properties };
  //   if (this.canvas) {
  //     this.canvas.onPropertiesChanged(this.currentProperties);
  //   }
  // }
  onPropertiesChange(properties: { [key: string]: any }) {
    this.currentProperties = { ...properties };
  }
}
