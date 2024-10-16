#!/usr/bin/env node

import pkg from '../package.json' assert { type: 'json' };
import { initialAction, downloadAction } from '../src/index.js';
import { Command } from 'commander';

const program = new Command();

program.name(pkg.name).version(pkg.version).description(pkg.description);

program.action(async () => {
	console.log('Hola');
	//await initialAction();
});

program
	.command('start')
	.description('Start Kick-DL to download multimedia content from Kick.com')
	.action(async () => {
		//await initialAction();
	});

/* program
	.command('download <url>')
	.description('Download a VOD or Clip from Kick.com')
	.action(async (webUrl, options) => {
		await downloadAction(webUrl, options);
	}); */

program.parse(process.argv);
