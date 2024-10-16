import puppeteer from 'puppeteer';

export default class KickScraper {
	constructor(options = {}) {
		this.options = options;
		this.browser = options.browser;
	}

	scrapeDataAsJson = async (url) => {
		let browser = null;
		let internalBrowser = false;

		try {
			const browserOptions = this.options.puppeteer || {};

			if (this.browser) {
				browser = this.browser;
			} else {
				browser = await puppeteer.launch({
					headless: 'new',
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
			throw error;
		} finally {
			if (browser && internalBrowser) {
				await browser.close();
			}
		}
	};

	fetchUrlData = async (url) => {
		const dataArray = url.split('/');
		const indexVideo = dataArray.indexOf('videos');
		const idVideo = dataArray[indexVideo + 1];
		const urlData = await this.scrapeDataAsJson(
			`https://kick.com/api/v1/video/${idVideo}/`
		);
		return urlData;
	};

	fetchChannelData = async (channel) =>
		await this.scrapeDataAsJson(
			`https://kick.com/api/v2/channels/${channel}`
		);

	fetchVideoData = async (channel) =>
		await this.scrapeDataAsJson(
			`https://kick.com/api/v2/channels/${channel}/videos?cursor=0&sort=date&time=all`
		);

	fetchClipData = async (channel) =>
		await this.scrapeDataAsJson(
			`https://kick.com/api/v2/channels/${channel}/clips?cursor=0&sort=view&time=all`
		);
}
