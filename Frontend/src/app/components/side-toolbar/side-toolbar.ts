import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './side-toolbar.html',
  styleUrl: './side-toolbar.css',
})
export class SideToolbar {
  @Output() toolSelected = new EventEmitter<string>();
  activeButton: string = '';

  selectTool(tool: string) {
    this.toolSelected.emit(tool);
  }
  setActive(btn: string) {
    this.activeButton = btn;
  }
}
