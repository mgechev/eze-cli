import {transpile} from '../eze-lang/dist';
import {writeFileSync, readdirSync, readFileSync, statSync, existsSync} from 'fs';
import {argv} from 'yargs';
import {dirSync, fileSync, SynchrounousResult} from 'tmp';
import {join} from 'path';
import * as chalk from 'chalk';

import webdriverUpdate from './lib/driver-update';
import webdriverRun  from './lib/driver-run';
import protractorStart  from './lib/protractor-start';
import {generateProtractorConfig} from './lib/protractor-config';

if (argv['i'] || argv['initialize']) {
  webdriverUpdate();
} else {

  const url = argv['u'] || argv['url'];
  const dir = argv['dir'] || argv['d'];

  const HELP =
  `You should provide a url using "--url" or "-u" and a directory,
  using "--dir" or "-d" which contains all the "*.eze" files that you want to run.`;

  if (!url || !dir) {
    console.log(chalk.blue(HELP));
    process.exit(1);
  }

  if (!existsSync(dir)) {
    console.error(chalk.red(`"${dir}" doesn't exists.`));
    process.exit(1);
  }

  const configFile = fileSync();
  const config = generateProtractorConfig(dir);
  writeFileSync(configFile.name, config.config);

  const shutdown = webdriverRun();

  setTimeout(() => {
    protractorStart(configFile.name, shutdown);
    // config.cleanup();
    // configFile.removeCallback();
  }, 5000);
}

