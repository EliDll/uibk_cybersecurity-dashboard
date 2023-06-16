import { Injectable } from '@angular/core';
import { Observable, filter, fromEvent, map } from 'rxjs';

export type FileEntry = {
  fileName: string;
  createdAt: Date;
  content: ArrayBuffer;
};

const STORAGE_KEY = 'recently-used-files';

@Injectable({ providedIn: 'root' })
export class CachedFileService {
  getCachedFiles(): FileEntry[] {
    return [];
  }

  readAndPersist(file: File): Observable<FileEntry> {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return fromEvent(reader, 'load').pipe(
      map((it) => it as ProgressEvent<FileReader>),
      filter((it) => !!it.target?.result),
      map((it) => {
        const entry = {
          fileName: file.name,
          createdAt: new Date(),
          content: it.target?.result as ArrayBuffer,
        } as FileEntry;

        try {
          this.saveEntry(entry);
        } catch {
          // Does not work if file is to large
        }
        return entry;
      })
    );
  }

  private saveEntry(entry: FileEntry): void {
    let entries = this.getCachedFiles();

    if (entries.length >= 5) {
      const sorted = entries.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
      sorted.splice(0, 1);
      entries = sorted;
    }

    entries.push(entry);
    const decoder = new TextDecoder();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        entries.map((entry) => {
          return { ...entry, content: decoder.decode(entry.content) };
        })
      )
    );
  }
}
