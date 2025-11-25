import { Component, EventEmitter, Output, Input, ViewChild } from '@angular/core';
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
  @Output() deleteRequest = new EventEmitter<void>();
  @Output() undoRequest = new EventEmitter<void>();
  @Output() redoRequest = new EventEmitter<void>();
  @Output() duplicateRequest = new EventEmitter<void>();
  @Input() canvasComponent?: Canvas;

  constructor(private httpService: HttpService) {}


  deleteSelected() {
    this.deleteRequest.emit();
  }
  onUndoClick() {
    this.undoRequest.emit();
  }
  duplicateSelected() {
    this.duplicateRequest.emit();
  }
  onRedoClick() {
    this.redoRequest.emit();
  }

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

        setTimeout(() => {
          if (this.canvasComponent?.canvas) {
            this.canvasComponent.canvas.renderAll();
          }
        }, 100);

        // Sync with backend
        this.httpService.importJSON(content).subscribe({
          next: () => {
            console.log('Synced with backend');
            alert('JSON imported successfully!');
          },
          error: (err) => console.error('Backend sync failed:', err)
        });
      } else {
        alert('Canvas not ready');
      }
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('Failed to import: Invalid JSON file');
    }
  }

  private importXML(content: string) {
    if (!this.canvasComponent) {
      alert('Canvas not ready');
      return;
    }

    this.httpService.importXML(content).subscribe({
      next: (message) => {
        console.log('Backend response:', message);

        // Wait a bit for backend to process, then reload
        setTimeout(() => {
          if (this.canvasComponent) {
            this.canvasComponent.loadShapesFromBackend();
            alert('XML imported successfully!');
          }
        }, 100);
      },
      error: (err) => {
        console.error('Error importing XML:', err);
        alert('Failed to import XML: ' + err.message);
      }
    });
  }

  onUndo() {
    if (this.canvasComponent) {
      this.canvasComponent.undo();
    }
  }

  onRedo() {
    if (this.canvasComponent) {
      this.canvasComponent.redo();
    }
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
