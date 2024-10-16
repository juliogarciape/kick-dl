import { input, select, confirm } from '@inquirer/prompts';
import { logMessage } from '../utils/index.js';
import { formatInput, customTransformer } from '../utils/a.js';
import KickApi from '../api/kick.js';

const API = new KickApi();

export const initialAction = async () => {
	try {
		let inputChannel = await input({
			message: 'Please, enter the Kick Channel:',
			required: true,
			transformer: customTransformer,
			theme: {
				prefix: logMessage('[*]', 'green'),
				style: {
					answer: (input) => logMessage(input, 'pink'),
				},
			},
		});

		inputChannel = formatInput(inputChannel);
		const infoChannel = await API.searchChannel(inputChannel);

		if (!infoChannel.status) {
			console.log(`❌ ${inputChannel} not found`);
			return;
		}

		const { username } = infoChannel.data.user;

		const contentType = await select({
			message: 'Select an option to list:',
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
					description: `- List past VODs from ${username}, ideal for full streams.`,
				},
				{
					name: 'Clips',
					value: 'clip',
					description: `- List short clips from ${username}, perfect for highlights.`,
				},
			],
		});
	} catch (error) {
		console.log(error);
	} finally {
	}
};
