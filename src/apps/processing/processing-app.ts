import { IApp } from '../common/app.interface';

export class ProcessingApp implements IApp {
  public run(): number {
    throw new Error('Method not implemented.');
  }
}
