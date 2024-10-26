import KickApi from './api/kick.js';
import downloadMedia from './lib/downloader.js';
import { convertTime } from './helpers.js';
import logs from './lib/logs.js';
import { input, select, confirm } from '@inquirer/prompts';
import ora from 'ora';

const handleExit = () => process.exit(0);
process.on('SIGINT', () => handleExit());
process.on('SIGTERM', () => handleExit());

const api = new KickApi();

const spinner = ora({
	text: 'Processing...',
	spinner: 'dots',
});

const formatInput = (input) => input.toLowerCase().replace(/\s+/g, '_');

const customPrefix = logs.green('[*]');

const customTransformer = (input, { isFinal }) => {
	if (isFinal) {
		const formatedText = formatInput(input);
		return logs.pink(formatedText);
	}
	return logs.pink(input);
};

export const initialAction = async () => {
	try {
		let inputChannel = await input({
			message: 'Please, enter the Kick Channel:',
			required: true,
			transformer: customTransformer,
			theme: {
				prefix: customPrefix,
				style: {
					answer: (input) => logs.pink(input),
				},
			},
		});

		inputChannel = formatInput(inputChannel);
		spinner.start();
		const result = await api.searchKickChannel(inputChannel);
		spinner.stop();

		if (result.status === false) {
			console.log(`❌ ${result.message}`);
			return;
		}

		const username = result.data.user.username;
		const contentType = await select({
			message: 'Select an option to list:',
			theme: {
				prefix: customPrefix,
				style: {
					answer: (input) => logs.yellow(input),
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

		spinner.start();
		const contentList = await api.listKickContent(
			inputChannel,
			contentType
		);
		spinner.stop();

		if (contentList.status === false) {
			console.log(`❌ ${contentList.message}`);
			return;
		}

		const orderedList = contentList.data.map((content) => {
			const hours = convertTime(content.duration);

			return {
				name:
					contentType === 'vod'
						? `${content.session_title} - ${hours} - ${content.start_time}`
						: `${content.title} - ${content.duration} seconds`,
				value:
					contentType === 'vod' ? content.source : content.clip_url,
				description:
					contentType === 'vod'
						? `- Description: ${content.session_title} | ${content.categories[0].name} | ${content.views} views`
						: `- Description: ${content.title} | ${content.category.name} | ${content.views} views`,
			};
		});

		const downloadLink = await select({
			message: `Select the ${contentType} to download:`,
			choices: [...orderedList],
			pageSize: 10,
			theme: {
				prefix: customPrefix,
				style: {
					answer: (input) => logs.blue(input),
				},
			},
			loop: false,
		});

		const confirmDownload = await confirm({
			message: `Ready to download the ${contentType} of ${username}, Continue?`,
			theme: {
				prefix: logs.green('[?]'),
				style: {
					answer: (input) => `\x1b[38;5;34m${input}\x1b[0m`,
				},
			},
		});

		if (confirmDownload) {
			spinner.start();
			await downloadMedia(contentType, downloadLink);
			spinner.stop();
		}
	} catch (error) {
		if (error.name === 'ExitPromptError') {
			console.info('================================');
			console.info('  Ah shit, here we go again 🐈  ');
			console.info('================================');
		}

		if (error.name === 'NetworkError') {
			console.log('❌ Network error... Please try again later');
		}
	} finally {
		handleExit();
	}
};
