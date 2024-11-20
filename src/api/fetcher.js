import { logMessage } from '../utils/index.js';
import Scraper from './scraper.js';

const KickScraper = new Scraper();

export const fetchVideo = async (url) => {
	try {
		const dataArray = url.split('/');
		const indexVideo = dataArray.indexOf('videos');
		const idVideo = dataArray[indexVideo + 1];
		const data = await KickScraper.scrapeData(
			`https://kick.com/api/v1/video/${idVideo}/`
		);
		return data;
	} catch (error) {
		return {
			error: true,
			message: error.message,
		};
	}
};

export const fetchChannel = async (channel) => {
	try {
		const data = await KickScraper.scrapeData(
			`https://kick.com/api/v2/channels/${channel}`
		);
		return data;
	} catch (error) {
		logMessage(error.message, 'red');
	}
};

export const fetchContentList = async (channel, contentType) => {
	try {
		if (contentType === 'Clip') {
			const data = await KickScraper.scrapeData(
				`https://kick.com/api/v2/channels/${channel}/clips?cursor=0&sort=view&time=all`
			);
			return data['clips'];
		}

		const data = await KickScraper.scrapeData(
			`https://kick.com/api/v2/channels/${channel}/videos?cursor=0&sort=date&time=all`
		);
		return data;
	} catch (error) {
		logMessage(error.message, 'red');
	}
};
