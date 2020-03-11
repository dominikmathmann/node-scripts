const fs = require('fs');
const path = require('path');
const args = process.argv;
const rootPath = args[2] + '/';
const root = fs.readdirSync(rootPath);
const cliSelect = require('cli-select');
const { spawn } = require('child_process');

const options = [];
root.forEach(f => parseOption(rootPath + f));

function parseOption(filename, lbl) {
  const stat = fs.statSync(filename);
  if (stat.isFile() && filename.endsWith('.code-workspace')) {
    const label = lbl || path.basename(filename).replace('.code-workspace', '');
    options.push({
      label,
      path: filename
    });
  } else if (stat.isDirectory()) {
    const label = path.basename(filename);
    options.push({
      label,
      path: fs.readdirSync(filename).map(f => filename + '/' + f)
    });
  }
}

function execute(programm) {
  console.log(programm);
  var cmd = spawn('C:\\Users\\Dominik Mathmann\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe', [programm], {
    detached: true,
    stdio: 'inherit'
  });
}

cliSelect({
  values: options,
  valueRenderer: (value, selected) => {
    return value.label;
  }
}).then(selected => {
  const value = selected.value.path;
  if (Array.isArray(value)) value.forEach(p => execute(p));
  else execute(value);
});
