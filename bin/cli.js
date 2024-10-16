#!/usr/bin/env node

import pkg from '../package.json' assert { type: 'json' };
import { initialAction } from '../src/actions/start.js';
import { Command } from 'commander';

const program = new Command();

program.name(pkg.name).version(pkg.version).description(pkg.description);

program.action(async () => await initialAction());

program.parse(process.argv);
