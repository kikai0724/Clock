#!/usr/bin/env node
'use strict';

const figlet = require('figlet');
const chalk = require('chalk');
const boxen = require('boxen');

function getTimeParts(now) {
	const h = String(now.getHours()).padStart(2, '0');
	const m = String(now.getMinutes()).padStart(2, '0');
	const s = String(now.getSeconds()).padStart(2, '0');
	return `${h}:${m}:${s}`;
}

function render() {
	const now = new Date();
	const timeStr = getTimeParts(now);
	const fig = figlet.textSync(timeStr, { horizontalLayout: 'full' });

	const colored = chalk.cyanBright(fig);
	const dateLine = chalk.magentaBright(now.toLocaleDateString() + '  ' + now.toLocaleTimeString([], { hour12: false }));

	const content = colored + '\n' + '\n' + chalk.yellowBright('  Press Ctrl+C to exit') + '\n' + dateLine;

	const boxed = boxen(content, {
		padding: 1,
		margin: 1,
		borderStyle: 'round',
		borderColor: 'magenta'
	});

	console.clear();
	console.log(boxed);
}

render();
const timer = setInterval(render, 1000);

process.on('SIGINT', () => {
	clearInterval(timer);
	console.clear();
	console.log(chalk.green('Goodbye!'));
	process.exit(0);
});
