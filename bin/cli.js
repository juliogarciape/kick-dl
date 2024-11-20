#!/usr/bin/env node

import { Command } from 'commander';
import { initialAction } from '../src/actions/start.js';

const program = new Command();

program
	.name('kick-dl')
	.version('2.0.0')
	.description(
		'CLI tool for easily downloading VODs and Clips from kick.com'
	);

program.action(async () => await initialAction());

program.command('start').action(async () => await initialAction());

program.parse(process.argv);
