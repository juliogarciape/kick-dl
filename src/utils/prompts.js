import { input, select, confirm } from '@inquirer/prompts';
import { logMessage, customTransformer } from './index.js';

export const promptChannelName = async () => {
	return await input({
		message: 'Please, enter the channel name:',
		required: true,
		transformer: customTransformer,
		theme: {
			prefix: logMessage('[*]', 'green'),
			style: {
				answer: (input) => logMessage(input, 'pink'),
			},
		},
	});
};

export const promptContentType = async (username) => {
	return await select({
		message: 'Now, select an option to list:',
		theme: {
			prefix: logMessage('[*]', 'green'),
			style: {
				answer: (input) => logMessage(input, 'yellow'),
			},
		},
		loop: true,
		choices: [
			{
				name: 'VODs',
				value: 'vod',
				description: `- List past VODs from ${username}, ideal for full streams ...`,
			},
			{
				name: 'Clips',
				value: 'clip',
				description: `- List short clips from ${username}, perfect for highlights ...`,
			},
		],
	});
};

export const promptConfirmDownload = async (contentType, username) => {
	return await confirm({
		message: `Ready to download the ${contentType} of ${username}, Continue?`,
		theme: {
			prefix: logMessage('[?]', 'green'),
			style: {
				answer: (input) => `\x1b[38;5;34m${input}\x1b[0m`,
			},
		},
	});
};

export const promptS = async (orderedList, contentType) => {
	return await select({
		message: `Select the ${contentType} to download:`,
		choices: [...orderedList],
		pageSize: 10,
		theme: {
			prefix: logMessage('[*]', 'green'),
			style: {
				answer: (input) => logMessage(input, 'blue'),
			},
		},
		loop: false,
	});
};
