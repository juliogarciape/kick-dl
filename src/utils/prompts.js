import { input, select, confirm } from '@inquirer/prompts';
import { logMessage, channelTransformer, confirmTransformer } from './index.js';
import { formatInput } from '../helpers/index.js';

export const promptChannelName = async () => {
	const inputChannel = await input({
		message: 'Please, enter the channel name:',
		required: true,
		transformer: channelTransformer,
		theme: {
			prefix: logMessage('[*]', 'green'),
		},
	});

	return formatInput(inputChannel);
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
				value: 'VOD',
				description: `- List past VODs from ${username}, ideal for full streams...`,
			},
			{
				name: 'Clips',
				value: 'Clip',
				description: `- List short clips from ${username}, perfect for highlights...`,
			},
		],
	});
};

export const promptContent = async (content, contentType) => {
	return await select({
		message: `Select the ${contentType} to download:`,
		choices: [...content],
		pageSize: 10,
		loop: false,
		theme: {
			prefix: logMessage('[*]', 'green'),
			style: {
				answer: (input) => logMessage(input, 'blue'),
			},
		},
	});
};

export const promptDownload = async (contentType, username) => {
	return await confirm({
		message: `Ready to download the ${contentType} of ${username}, Continue?`,
		default: true,
		transformer: confirmTransformer,
		theme: {
			prefix: logMessage('[?]', 'green'),
		},
	});
};
