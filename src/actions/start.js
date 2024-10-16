import { aea, logMessage } from '../utils/index.js';
import { formatInput } from '../helpers/index.js';
import downloader from '../lib/downloader.js';
import KickApi from '../api/dataFetcher.js';
import {
	promptChannelName,
	promptContentType,
	promptConfirmDownload,
	promptS,
} from '../utils/prompts.js';

const API = new KickApi();
const handleExit = () => process.exit(0);
process.on('SIGINT', () => handleExit());
process.on('SIGTERM', () => handleExit());

export const initialAction = async () => {
	try {
		let inputChannel = await promptChannelName();
		inputChannel = formatInput(inputChannel);
		const infoChannel = await API.getChannelInfo(inputChannel);

		if (infoChannel.error) {
			logMessage(infoChannel.message, 'green');
			return;
		}

		const { username } = infoChannel.data.user;
		const selectedContentType = await promptContentType(username);
		const contentList = await API.getContentList(
			inputChannel,
			selectedContentType
		);

		if (contentList.error) {
			logMessage(contentList.message, 'green');
			return;
		}

		const orderedList = aea(contentList.data, selectedContentType);
		const selectContent = await promptS(orderedList, selectedContentType);
		const confirmDownload = await promptConfirmDownload(
			selectedContentType,
			username
		);

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
			logMessage('❌ Network error... Please try again later', 'red');
		}

		console.log(error);
	} finally {
		console.log('Finished!');
	}
};
