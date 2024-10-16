import { externalDownloader, nativeDownloader } from './lib/downloader.js';
import { convertTime } from './helpers/index.js';
import ora from 'ora';

const handleExit = () => process.exit(0);
process.on('SIGINT', () => handleExit());
process.on('SIGTERM', () => handleExit());

const spinner = ora({
	text: 'Processing...',
	spinner: 'dots',
});

export const downloadAction = async (webUrl, options) => {
	try {
		const videoUrl = await Api.getMediaFile(webUrl);
		await nativeDownloader(videoUrl, options);
	} catch (error) {
		console.log(error);
	} finally {
		handleExit();
	}
};

export const initialAction = async () => {
	try {
		spinner.start();
		const contentList = await Api.listKickContent(
			inputChannel,
			contentType
		);
		spinner.stop();

		if (contentList.status === false) {
			console.log(`❌ The content of ${username} is not avaible`);
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
			await externalDownloader(contentType, downloadLink);
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
	}
};
