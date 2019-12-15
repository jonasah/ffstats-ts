import { Arguments, Argv } from 'yargs';

export function parseArguments(argv: Argv, args: string): Promise<Arguments> {
  return new Promise((resolve, reject) => {
    argv.parse(args, {}, (err, argv) => {
      if (err) {
        reject(err);
      }

      resolve(argv);
    });
  });
}
