import { Component,Output,EventEmitter} from '@angular/core';
import { App } from '../../app';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-properties-panel',
  imports: [FormsModule,DecimalPipe],
  templateUrl: './properties-panel.html',
  styleUrl: './properties-panel.css',
})
export class PropertiesPanel {
  constructor(public app: App) {}

  // default properties
  strokeWidth = 5;
  strokeColor = '#000000';
  fillColor = 'transparent';
  opacity = 1;
  lineStyle = 'solid';

 @Output() properties = new EventEmitter<any>(); 
 emitProperties() {
    this.properties.emit({
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor,
      opacity: this.opacity,
      lineStyle: this.lineStyle
    });
  }

   onChange() {
    this.emitProperties();
  }

  clearCanvas() {
    this.app.clearCanvas();
  }
}
