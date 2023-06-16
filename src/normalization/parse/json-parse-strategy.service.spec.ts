import { TestBed } from '@angular/core/testing';
import { JSONParseStrategy } from './json-parse-strategy.service';

function getParser<T>(): JSONParseStrategy<T> {
  TestBed.configureTestingModule({
    providers: [JSONParseStrategy],
  });
  return TestBed.inject(JSONParseStrategy) as JSONParseStrategy<T>;
}

describe('JSONParseStrategy', () => {
  it('works with simple input', () => {
    const expected = {
      max: 'tests',
    };

    const parser = getParser<typeof expected>();

    const encoder = new TextEncoder();
    const input = encoder.encode(JSON.stringify(expected));
    const actual = { max: '' };
    parser.parseInto(input, actual);

    expect(actual).toEqual(expected);
  });
});
