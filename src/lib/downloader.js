import { exec } from 'child_process';
import { promisify } from 'util';

export const nativeDownloader = async (url, options) => {
	try {
		console.log('Downloading content from:', url);

		ffmpeg(
			'https://stream.kick.com/ivs/v1/196233775518/LlgJ3azb4XGI/2024/9/19/1/35/y0ywFKQumD4B/media/hls/360p30/playlist.m3u8'
		)
			.output('./content.mp4')
			.on('end', () => {
				console.log('Processing finished !');
			})
			.on('error', (error) => {
				console.log(error);
			})
			.run();
	} catch (error) {
		console.log(error);
	}
};

export const externalDownloader = async (
	contentType = 'media',
	downloadLink
) => {
	const execPromise = promisify(exec);
	const command = `youtube-dl -o ${contentType}.mp4 "${downloadLink}"`;

	try {
		const { stdout } = await execPromise(command);

		return stdout;
	} catch (error) {
		return error;
	}
};
