
import { exec } from 'child_process';
import path from 'path';

console.log('Executing schema check script...');

const scriptPath = path.join(__dirname, 'schema-check.ts');

exec(`ts-node ${scriptPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error}`);
    return;
  }
  
  console.log('Schema Check Output:');
  console.log(stdout);
  
  if (stderr) {
    console.error('Stderr:', stderr);
  }
});
