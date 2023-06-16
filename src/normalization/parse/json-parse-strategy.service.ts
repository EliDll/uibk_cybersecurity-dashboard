import { Injectable } from '@angular/core';
import { ParserStrategy } from './parse-strategy';

@Injectable({ providedIn: 'root' })
export class JSONParseStrategy<TResult> implements ParserStrategy<TResult> {
  parseInto(input: ArrayBuffer, out: TResult): boolean {
    const decoder = new TextDecoder('utf-8');

    const keys = Object.getOwnPropertyNames(out);

    const parsedJson = JSON.parse(decoder.decode(input));

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const v = parsedJson[key];
      if (v === undefined) {
        return false;
      } else {
        (out as Record<string, unknown>)[key] = v;
      }
    }

    return true;
  }
}
