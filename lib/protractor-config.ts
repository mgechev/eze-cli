import {transpile} from '../../eze-lang/dist';
import {writeFileSync, readdirSync, readFileSync, statSync} from 'fs';
import {dirSync, fileSync, SynchrounousResult} from 'tmp';
import {join} from 'path';

export interface ProtractorConfig {
  configFile: string;
  specFiles: string[];
}

export const stringifyConfig = (config: ProtractorConfig) => {
  const files = config.specFiles;
  return `exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [${files.map(f => '"' + f + '"').join(', ')}]
};`;
};

export const generateProtractorConfig = (dir: string) => {
  const getTestFiles = (current: string): string[] => {
    const allFiles = readdirSync(current).map(f => join(current, f));
    const dirs = allFiles.filter((f: string) => statSync(f).isDirectory());
    const files = allFiles.filter((f: string) => statSync(f).isFile() && f.endsWith('.eze'));
    return files.concat.apply(files, dirs.map((d: string) => getTestFiles(d)));
  };

  const testFiles = getTestFiles(dir);

  const files: SynchrounousResult[] = [];
  testFiles.forEach(f => {
    const test = readFileSync(f).toString();
    const file = fileSync();
    writeFileSync(file.name, transpile(test));
    files.push(file);
  });

  return {
    cleanup: () => files.forEach(f => f.removeCallback()),
    config: stringifyConfig({
      configFile: '',
      specFiles: files.map(f => f.name)
    })
  };
};
