import KickScraper from './scraper.js';

const Scraper = new KickScraper();

export default class KickApi {
	getMediaFile = async (url) => {
		try {
			const result = await Scraper.fetchUrlData(url);
			return result.source;
		} catch (error) {
			return {
				error: true,
				message: '',
			};
		}
	};

	getChannelInfo = async (channel) => {
		try {
			const result = await Scraper.fetchChannelData(channel);

			return {
				data: result,
			};
		} catch (error) {
			return {
				error: true,
				message: 'Channel not found',
			};
		}
	};

	getContentList = async (channel, contentType) => {
		try {
			if (contentType === 'vod') {
				const result = await Scraper.fetchVideoData(channel);
				return {
					data: result,
				};
			}

			const result = await Scraper.fetchClipData(channel);
			return {
				data: result['clips'],
			};
		} catch (error) {
			return {
				error: true,
				message: 'Content not avaible',
			};
		}
	};
}
