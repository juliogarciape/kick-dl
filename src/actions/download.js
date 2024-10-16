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
