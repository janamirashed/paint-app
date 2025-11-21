import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Shape } from '../../models/shape';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  templateUrl: './properties-panel.html',
  styleUrls: ['./properties-panel.css'],
})
export class PropertiesPanel {

  @Input() selectedShape!: Shape;
  @Output() propertiesChanged = new EventEmitter<Shape>();

  // UI Values (synced to selectedShape)
  strokeWidth = 5;
  strokeColor = '#000000';
  fillColor = 'transparent';
  opacity = 1;
  lineStyle = 'solid';

  constructor() {}

  // Called whenever HTML input changes
  onChange() {
    if (!this.selectedShape) return;

    // Update the MAP (properties: {[key:string]: any})
    this.selectedShape.properties["strokeWidth"] = this.strokeWidth;
    this.selectedShape.properties["strokeColor"] = this.strokeColor;
    this.selectedShape.properties["fillColor"] = this.fillColor;
    this.selectedShape.properties["opacity"] = this.opacity;
    this.selectedShape.properties["lineStyle"] = this.lineStyle;

    // Notify canvas
    this.propertiesChanged.emit(this.selectedShape);
  }

  // Called when user selects a new shape
  ngOnChanges() {
    if (!this.selectedShape) return;

    this.strokeWidth = this.selectedShape.properties["strokeWidth"] ?? 5;
    this.strokeColor = this.selectedShape.properties["strokeColor"] ?? "#000000";
    this.fillColor = this.selectedShape.properties["fillColor"] ?? "transparent";
    this.opacity = this.selectedShape.properties["opacity"] ?? 1;
    this.lineStyle = this.selectedShape.properties["lineStyle"] ?? "solid";
  }
}
