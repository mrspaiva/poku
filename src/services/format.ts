import { fileResults } from '../configs/files.js';
import { indentation } from '../configs/indentation.js';
import { Write } from '../services/write.js';

export const backgroundColor = {
  white: 7,
  black: 40,
  grey: 100,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  brightRed: 101,
  brightGreen: 102,
  brightYellow: 103,
  brightBlue: 104,
  brightMagenta: 105,
  brightCyan: 106,
} as const;

export class Formatter {
  private parts = '';
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  static create(text: string) {
    return new Formatter(text);
  }

  counter(current: number, total: number, pad = '0') {
    const totalDigits = String(total).length;
    const formattedCounter = String(current).padStart(totalDigits, pad);
    this.parts += formattedCounter;
    return this;
  }

  dim() {
    this.parts += '\x1b[2m';
    return this;
  }

  bold() {
    this.parts += '\x1b[1m';
    return this;
  }

  underline() {
    this.parts += '\x1b[4m';
    return this;
  }

  info() {
    this.parts += '\x1b[94m';
    return this;
  }

  italic() {
    this.parts += '\x1b[3m';
    return this;
  }

  success() {
    this.parts += '\x1b[32m';
    return this;
  }

  fail() {
    this.parts += '\x1b[91m';
    return this;
  }

  gray() {
    this.parts += '\x1b[90m';
    return this;
  }

  cyan() {
    this.parts += '\x1b[96m';
    return this;
  }

  bg(color: keyof typeof backgroundColor) {
    this.parts += `\x1b[${backgroundColor[color]}m\x1b[1m`;
    return this;
  }

  [Symbol.toPrimitive]() {
    return `${this.parts}${this.text}\x1b[0m`;
  }
}

export const format = (text: string) => Formatter.create(text);

export const getLargestStringLength = (arr: string[]): number =>
  arr.reduce((max, current) => Math.max(max, current.length), 0);

export const showTestResults = () => {
  Write.hr();

  if (fileResults.success.size > 0 && fileResults.fail.size === 0) {
    Write.log(
      Array.from(fileResults.success)
        .map(
          ([file, time]) =>
            `${indentation.test}${format('✔').success()} ${format(`${file} ${format(`› ${time}ms`).success()}`).dim()}`
        )
        .join('\n')
    );

    return;
  }

  if (fileResults.fail.size > 0) {
    Write.log(
      Array.from(fileResults.fail)
        .map(
          ([file, time]) =>
            `${indentation.test}${format('✘').fail()} ${format(`${file} ${format(`› ${time}ms`).fail()}`).dim()}`
        )
        .join('\n')
    );
  }
};
