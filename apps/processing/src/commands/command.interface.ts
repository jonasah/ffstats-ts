export interface ICommand {
  name: string;

  parseArguments(args: string[]): void;
  run(): Promise<void>;
}
