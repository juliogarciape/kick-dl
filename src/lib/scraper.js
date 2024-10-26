import puppeteer from 'puppeteer';

export default class KickScraper {
	constructor(options = {}) {
		this.options = options;
		this.browser = options.browser;
	}

	scrapeData = async (url) => {
		let browser = null;
		let internalBrowser = false;

		try {
			const browserOptions = this.options.puppeteer || {};

			if (this.browser) {
				browser = this.browser;
			} else {
				browser = await puppeteer.launch({
					headless: 'new',
					args: ['--no-sandbox'],
					...browserOptions,
				});

				internalBrowser = true;
			}

			const page = await browser.newPage();
			await page.setUserAgent(
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
			);

			const response = await page.goto(url, {
				waitUntil: 'networkidle2',
				...this.options.gotoOptions,
			});

			if (response && response.ok()) {
				const data = await page.evaluate(
					() => document.body.textContent
				);

				return JSON.parse(data);
			} else {
				throw new Error(
					`Failed to load URL: ${response?.status()} - ${response?.statusText()}`
				);
			}
		} catch (error) {
			return { status: false, message: error.message }; // P04c8
		} finally {
			if (browser && internalBrowser) {
				await browser.close();
			}
		}
	};

	fetchChannelData = async (channel) => {
		const result = await this.scrapeData(`https://kick.com/api/v2/channels/${channel}`);
		if (result.status === false) {
			throw new Error(result.message);
		}
		return result;
	};

	fetchVideoData = async (channel) => {
		const result = await this.scrapeData(
			`https://kick.com/api/v2/channels/${channel}/videos?cursor=0&sort=date&time=all`
		);
		if (result.status === false) {
			throw new Error(result.message);
		}
		return result;
	};

	fetchClipData = async (channel) => {
		const result = await this.scrapeData(
			`https://kick.com/api/v2/channels/${channel}/clips?cursor=0&sort=view&time=all`
		);
		if (result.status === false) {
			throw new Error(result.message);
		}
		return result;
	};
}
