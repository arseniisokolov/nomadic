'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('react-dev-utils/chalk');

const appsDir = path.join(__dirname, '../src/apps');

console.log(chalk.cyan('Available apps in nomadic framework:'));
console.log('');

if (fs.existsSync(appsDir)) {
  const apps = fs.readdirSync(appsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();

  if (apps.length === 0) {
    console.log(chalk.yellow('No apps found.'));
  } else {
    apps.forEach((app, index) => {
      const appPath = path.join(appsDir, app);
      const hasIndex = fs.existsSync(path.join(appPath, 'index.js'));
      const hasCartography = fs.existsSync(path.join(appPath, 'Cartography.jsx'));
      const hasCSS = fs.existsSync(path.join(appPath, 'Cartography.css'));
      
      const status = hasIndex ? chalk.green('✓') : chalk.red('✗');
      const details = [];
      if (hasCartography) details.push('Cartography.jsx');
      if (hasCSS) details.push('Cartography.css');
      
      console.log(`${status} ${chalk.bold(app)}`);
      if (details.length > 0) {
        console.log(`   ${chalk.gray(details.join(', '))}`);
      }
      console.log('');
    });
    
    console.log(chalk.cyan('Usage:'));
    console.log(`  npm run start-app <AppName>`);
    console.log('');
    console.log(chalk.cyan('Examples:'));
    apps.slice(0, 3).forEach(app => {
      console.log(`  npm run start-app ${app}`);
    });
  }
} else {
  console.log(chalk.red('Apps directory not found.'));
} 