import {exec} from 'child_process';

export default (configFile: string, done = () => {}) => {
  exec('./node_modules/.bin/protractor ' + configFile, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
      done();
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
  });
};
