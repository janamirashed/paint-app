import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertiesPanel } from './components/properties-panel/properties-panel';
import { Canvas } from './components/canvas/canvas';
import { HeaderToolbar } from './components/header-toolbar/header-toolbar';
import { SideToolbar } from './components/side-toolbar/side-toolbar';

@Component({
  selector: 'app-root',
  imports: [ PropertiesPanel , Canvas , HeaderToolbar, SideToolbar ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
}
