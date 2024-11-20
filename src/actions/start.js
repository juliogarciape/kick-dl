import {
	promptChannelName,
	promptContent,
	promptContentType,
	promptDownload,
} from '../utils/prompts.js';
import API from '../api/index.js';
import { formatContent } from '../helpers/index.js';
import { Downloader } from '../lib/downloader.js';

/*const handleExit = () => process.exit(0);
process.on('SIGINT', () => handleExit());
process.on('SIGTERM', () => handleExit());*/

export const initialAction = async () => {
	try {
		const channel = await promptChannelName();
		const infoChannel = await API.fetchChannel(channel);
		const { username } = infoChannel.user;
		const contentType = await promptContentType(username);
		const contentList = await API.fetchContentList(channel, contentType);
		const formattedContent = formatContent(contentList, contentType);
		const content = await promptContent(formattedContent, contentType);
		const confirmDownload = await promptDownload(contentType, username);
		const statusDownload = await Downloader(confirmDownload, content);
		console.log(statusDownload.message);
	} catch (error) {
		if (error.name === 'ExitPromptError') {
			process.exit(0);
		}

		throw error;
	} finally {
		//console.log('Finished');
	}
};
