import { Component, EventEmitter, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CachedFileService, FileEntry } from '../../normalization';

@Component({
  selector: 'app-import-card',
  templateUrl: './import-card.component.html',
  styleUrls: ['./import-card.component.scss'],
})
export class ImportCardComponent {
  @Output()
  fileSelected: EventEmitter<FileEntry> = new EventEmitter<FileEntry>();

  entries: FileEntry[];

  constructor(private readonly fileService: CachedFileService) {
    this.entries = fileService.getCachedFiles();
  }

  async onFileChange(event: Event): Promise<void> {
    const files = (<HTMLInputElement>event.target).files;
    if (!files || !files.length) {
      return;
    }

    const file = files.item(0);
    if (!file) {
      return;
    }

    const entry = await firstValueFrom(this.fileService.readAndPersist(file));
    this.entries.push(entry);

    this.fileSelected.emit(entry);
  }
}
