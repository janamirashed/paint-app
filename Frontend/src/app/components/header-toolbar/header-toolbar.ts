import { Component, EventEmitter, Output, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Canvas } from '../canvas/canvas';

@Component({
  selector: 'app-header-toolbar',
  imports: [],
  templateUrl: './header-toolbar.html',
  styleUrl: './header-toolbar.css',
})
export class HeaderToolbar {

  @Output() shapesImported = new EventEmitter<void>();
  @Input() canvasComponent!: Canvas;

  constructor(private httpService: HttpService) {}

  saveJSON() {
    if (!this.canvasComponent) {
      alert('Canvas not ready');
      return;
    }

    // get entire canvas as JSON
    const canvasJson = this.canvasComponent.getCanvasAsJSON();
    const blob = new Blob([canvasJson], { type: 'application/json' });
    this.downloadFile(blob, 'drawing.json');
  }

  saveXML() {
    this.httpService.exportXML().subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'drawing.xml');
      },
      error: (err) => {
        console.error('Error exporting XML:', err);
        alert('Failed to export XML');
      }
    });
  }

  loadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.xml';

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.readAndImportFile(file);
      }
    };

    input.click();
  }

  private readAndImportFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const content = e.target.result;

      if (file.name.endsWith('.json')) {
        this.importJSON(content);
      } else if (file.name.endsWith('.xml')) {
        this.importXML(content);
      } else {
        alert('Invalid file type');
      }
    };

    reader.readAsText(file);
  }

  private importJSON(content: string) {
    try {
      JSON.parse(content);

      if (this.canvasComponent) {
        this.canvasComponent.loadCanvasFromJSON(content);
        alert('Imported successfully!');

        this.httpService.importJSON(content).subscribe({
          next: () => console.log('Synced with backend'),
          error: (err) => console.error('Backend sync failed:', err)
        });
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('Failed to import: Invalid JSON file');
    }
  }

  private importXML(content: string) {
    this.httpService.importXML(content).subscribe({
      next: (message) => {
        alert('Imported successfully!');
        this.shapesImported.emit();

        if (this.canvasComponent) {
          this.canvasComponent.loadShapesFromBackend();
        }
      },
      error: (err) => {
        console.error('Error importing XML:', err);
        alert('Failed to import');
      }
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
