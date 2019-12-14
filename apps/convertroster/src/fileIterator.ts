import fs from 'fs';

export class FileIterator {
  private readonly gen: Generator<string, string, unknown>;

  constructor(path: string) {
    this.gen = this.generator(path);
  }

  public nextLine(): string | null {
    const v = this.gen.next();

    if (v.done) {
      return null;
    }

    return v.value;
  }

  private *generator(path: string) {
    const lines = fs
      .readFileSync(path)
      .toString()
      .split('\n')
      .map(line => line.replace('\r', ''));

    for (const line of lines) {
      yield line;
    }

    return null;
  }
}
