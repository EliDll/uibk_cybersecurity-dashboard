import { Component } from '@angular/core';
import { FileEntry } from '../../normalization';
import { ImportService } from '../../normalization';

@Component({
  selector: 'app-import-view',
  templateUrl: './import-view.component.html',
  styleUrls: ['./import-view.component.scss'],
})
export class ImportViewComponent {
  constructor(private importService: ImportService) {}

  onFileSelected(file: FileEntry): void {
    this.importService.handleImport(file);
  }
}
