const { exec } = require('child-process-promise');

const npmInstall = (package) =>
  exec(`docker run -v $(cd ~/.ssh && pwd):/root/.ssh node bash -c "npm install -g ${package}"`);

const timeRegex = /^added .* in (.*)$/m;
const parseTime = (result) => {
  const matches = result.stdout.match(timeRegex);

  if (!matches) {
    throw new Error(`Cant parse time from "${result.stdout}"`);
  }
  return matches[1];
}

const printResults = (package) => (result) => console.log(`${parseTime(result)} - npm install ${package}`);

const timeInstall = (package) => npmInstall(package).then(printResults(package))

timeInstall('express@4.16.3');
timeInstall('expressjs/express#4.16.3');
timeInstall('git://github.com/expressjs/express#4.16.3');
timeInstall('git+ssh://git@github.com/expressjs/express#4.16.3');
