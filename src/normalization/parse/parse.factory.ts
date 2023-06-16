import { Injectable } from '@angular/core';
import { JSONParseStrategy } from './json-parse-strategy.service';
import { ParserStrategy } from './parse-strategy';
import { XLSXParseStrategy } from './xlsx-parse-strategy.service';

@Injectable({ providedIn: 'root' })
export class ParseFactory<T> {
  constructor(
    private readonly jsonParseStrategy: JSONParseStrategy<T>,
    private readonly xlsxParseStrategy: XLSXParseStrategy<T>
  ) {}

  getStrategy(filename: string): ParserStrategy<T> {
    const splitted = filename.split('.');
    if (!splitted.length) {
      throw new Error('Invalid file name');
    }

    const ending = splitted[splitted.length - 1].toLocaleLowerCase();
    switch (ending) {
      case 'json':
        return this.jsonParseStrategy;
      case 'xlsx':
        return this.xlsxParseStrategy;
      default:
        throw new Error('Unknown ending ' + ending);
    }
  }
}
