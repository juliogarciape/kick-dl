import KickScraper from '../lib/scraper.js';

const Scraper = new KickScraper();

export default class KickApi {
	getMediaFile = async (url) => {
		try {
			const result = await Scraper.fetchUrlData(url);
			return result.source;
		} catch (error) {
			return {
				status: false,
				message: 'Invalid URL',
			};
		}
	};

	searchChannel = async (channel) => {
		try {
			const result = await Scraper.fetchChannelData(channel);

			return {
				status: true,
				data: result,
			};
		} catch (error) {
			return {
				status: false,
				message: 'Channel not found',
			};
		}
	};

	listKickContent = async (channel, contentType) => {
		try {
			if (contentType === 'vod') {
				const result = await Scraper.fetchVideoData(channel);
				return {
					status: true,
					data: result,
				};
			}

			const result = await Scraper.fetchClipData(channel);
			return {
				status: true,
				data: result['clips'],
			};
		} catch (error) {
			return {
				status: false,
				message: 'Content not avaible',
			};
		}
	};
}
