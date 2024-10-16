import { input, select, confirm } from '@inquirer/prompts';
import { logMessage } from '../utils/index.js';
import { convertTime } from '../helpers/index.js';
import { formatInput, customTransformer } from '../utils/a.js';
import downloader from '../lib/downloader.js';
import KickApi from '../api/kick.js';

const API = new KickApi();
const handleExit = () => process.exit(0);
process.on('SIGINT', () => handleExit());
process.on('SIGTERM', () => handleExit());

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

		const selectedOption = await select({
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

		const infoContent = await API.listKickContent(
			inputChannel,
			selectedOption
		);

		if (infoContent.status === false) {
			console.log(`❌ The content of ${username} is not avaible`);
			return;
		}

		const orderedList = infoContent.data.map((content) => {
			const hours = convertTime(content.duration);

			return {
				name:
					selectedOption === 'vod'
						? `${content.session_title} - ${hours} - ${content.start_time}`
						: `${content.title} - ${content.duration} seconds`,
				value:
					selectedOption === 'vod'
						? content.source
						: content.clip_url,
				description:
					selectedOption === 'vod'
						? `- Description: ${content.session_title} | ${content.categories[0].name} | ${content.views} views`
						: `- Description: ${content.title} | ${content.category.name} | ${content.views} views`,
			};
		});

		const selectContent = await select({
			message: `Select the ${selectedOption} to download:`,
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

		const confirmDownload = await confirm({
			message: `Ready to download the ${selectedOption} of ${username}, Continue?`,
			theme: {
				prefix: logMessage('[?]', 'green'),
				style: {
					answer: (input) => `\x1b[38;5;34m${input}\x1b[0m`,
				},
			},
		});

		if (confirmDownload) {
			const statusDownload = await downloader(selectContent);
			console.log(statusDownload);
		}
	} catch (error) {
		if (error.name === 'ExitPromptError') {
			logMessage('================================', 'yellow');
			logMessage('Ah shit, here we go again', 'yellow');
			logMessage('================================', 'yellow');
		}

		if (error.name === 'NetworkError') {
			console.log('❌ Network error... Please try again later');
		}

		console.log(error);
	} finally {
	}
};
