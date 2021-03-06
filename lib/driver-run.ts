import {exec} from 'child_process';

export default () => {
  exec('./node_modules/.bin/webdriver-manager start', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
  });
  return () => {
    exec('./node_modules/.bin/webdriver-manager shutdown');
  };
};
