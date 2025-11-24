import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './properties-panel.html',
  styleUrls: ['./properties-panel.css'],
})
export class PropertiesPanel {
  @Output() propertiesChanged = new EventEmitter<{ [key: string]: any }>();
  @Output() clear = new EventEmitter<void>();
  // UI Values
  strokeWidth = 5;
  strokeColor = '#000000';
  fillColor = 'transparent';
  opacity = 1;
  lineStyle = 'solid';

  constructor() {}

  // Called whenever HTML input changes
  onChange() {
    const properties = {
      strokeWidth: this.strokeWidth,
      strokeColor: this.strokeColor,
      fillColor: this.fillColor,
      opacity: this.opacity,
      lineStyle: this.lineStyle
    };

    // Emit the properties object
    this.propertiesChanged.emit(properties);
  }
}
