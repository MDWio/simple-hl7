import { Delimiters } from "./delimiters";

export declare class Field<T extends string | number | { toString: () => string }> {
  constructor(...args: T[]);
  constructor(...args: T[][]);
  value: (T | T[])[];
  toString(delimiters: Delimiters): string;
}
