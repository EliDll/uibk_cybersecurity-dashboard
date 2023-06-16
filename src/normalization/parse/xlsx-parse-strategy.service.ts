import { Injectable } from '@angular/core';
import { ParserStrategy } from './parse-strategy';
import * as XLSX from 'xlsx';

type ObjType = Record<string, EntryType>;
type EntryType = Record<string, unknown>[] | undefined;

const ARRAY_DELIMITER = ',';

const log = (msg: string) => console.log('[XLSX Import] ', msg);

@Injectable({ providedIn: 'root' })
export class XLSXParseStrategy<TResult> implements ParserStrategy<TResult> {
  parseInto(input: ArrayBuffer, out: TResult): boolean {
    const workbook = XLSX.read(input);
    const workBookProps = workbook.Workbook;

    const keys = Object.getOwnPropertyNames(out);

    if (workBookProps) {
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (workBookProps.Sheets?.find((s) => s.name === key) === undefined) {
          log(`Could not find key ${key} in workbook`);
          return false;
        } else {
          const outTyped = out as ObjType;

          const refObj = outTyped[key];
          outTyped[key] = this.parseSheet(workbook.Sheets[key], refObj);
          if (outTyped[key] === undefined) {
            log(`Error parsing worksheet for ${key}`);
            return false;
          }
        }
      }

      return true;
    } else {
      log(`Could not correctly parse table headers`);
      return false;
    }
  }

  parseSheet(sheet: XLSX.WorkSheet, refObj: EntryType): EntryType {
    if (!refObj) {
      return undefined;
    }
    const entities = XLSX.utils.sheet_to_json(sheet) as EntryType;

    if (!entities) {
      return undefined;
    }

    const matrix = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

    const objectKeys = Object.getOwnPropertyNames(refObj[0]);

    if (matrix.length === 0) {
      log(`Could not find table header row`);
      return undefined;
    } else {
      const columnKeys = matrix[0];

      for (let i = 0; i < objectKeys.length; i++) {
        const objKey = objectKeys[i];
        if (!columnKeys.includes(objKey)) {
          log(`Could not find model key ${objKey} in header row`);
          return undefined;
        }
      }

      //Keys match, proceed
      objectKeys.map((key) => {
        //Parse any cell value with a delimiter present into string array
        const isArrayKey = Array.isArray(refObj[0][key]);
        if (isArrayKey) {
          //Iterate over all cells in this key column
          entities.map((entity) => {
            const v = entity[key];
            if (typeof v === 'string') {
              entity[key] = v.split(ARRAY_DELIMITER);
            } else {
              //e.g. empty cell
              entity[key] = [''];
            }
          });
        }
      });
    }

    return entities;
  }
}
