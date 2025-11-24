import { Component, EventEmitter, Output} from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-header-toolbar',
  imports: [],
  templateUrl: './header-toolbar.html',
  styleUrl: './header-toolbar.css',
})
export class HeaderToolbar {

  @Output() shapesImported = new EventEmitter<void>();

  constructor(private httpService: HttpService) {}

  saveJSON() {
    this.httpService.exportJSON().subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'drawing.json');
      },
      error: (err) => {
        console.error('Error exporting JSON:', err);
        alert('Failed to export JSON');
      }
    });
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
    this.httpService.importJSON(content).subscribe({
      next: (message) => {
        alert('Imported successfully!');
        this.shapesImported.emit();
      },
      error: (err) => {
        console.error('Error importing JSON:', err);
        alert('Failed to import');
      }
    });
  }

  private importXML(content: string) {
    this.httpService.importXML(content).subscribe({
      next: (message) => {
        alert('Imported successfully!');
        this.shapesImported.emit();
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
