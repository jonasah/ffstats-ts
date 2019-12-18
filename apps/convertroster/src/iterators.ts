import fs from 'fs';

export abstract class LineIterator {
  private readonly gen: Generator<string, string, unknown>;

  protected constructor(lines: string[]) {
    this.gen = this.generator(lines);
  }

  public nextLine(): string | null {
    const v = this.gen.next();

    if (v.done) {
      return null;
    }

    return v.value;
  }

  private *generator(lines: string[]) {
    for (const line of lines) {
      yield line;
    }

    return null;
  }
}

export class StringIterator extends LineIterator {
  constructor(str: string) {
    super(str.split('\n').map(line => line.replace('\r', '')));
  }
}

export class FileIterator extends StringIterator {
  constructor(path: string) {
    super(fs.readFileSync(path, 'utf-8'));
  }
}
