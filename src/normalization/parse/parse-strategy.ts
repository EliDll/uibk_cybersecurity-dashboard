export interface ParserStrategy<TResult> {
  parseInto: (input: ArrayBuffer, out: TResult) => boolean;
}
