import { spawn } from 'child_process';
import pathToFfmpeg from 'ffmpeg-static';
import { performance } from 'perf_hooks';
import { formatDuration, intervalToDuration } from 'date-fns';

const downloader = async (url, options) => {
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

/* stdout.on('data', (data) => {
	const lines = data.toString().split('\n');
	lines.forEach((line) => {
		if (line.startsWith('size=')) {
			downloadedSize = parseInt(line.split('=')[1]);
		}
		if (line.startsWith('total_size=')) {
			totalSize = parseInt(line.split('=')[1]);
		}
	});

	if (downloadedSize && totalSize) {
		const percentage = (downloadedSize / totalSize) * 100;
		console.log(`Descargado: ${percentage.toFixed(2)}%`);
	}
}); */

let chales =
	'https://stream.kick.com/ivs/v1/196233775518/LlgJ3azb4XGI/2024/9/19/1/35/y0ywFKQumD4B/media/hls/720p30/playlist.m3u8';
let vod =
	'https://stream.kick.com/ivs/v1/196233775518/gzFppB5CwNS7/2024/10/7/0/59/kUKUajUUKd1h/media/hls/1080p/playlist.m3u8';
const downloadLink = vod;
const command = pathToFfmpeg;

const args = [
	'-y',
	'-xerror',
	'-i',
	downloadLink,
	'-threads',
	'0',
	'-c',
	'copy',
	'-progress',
	'pipe:1',
	'video.mp4',
];

const startTime = performance.now();
const ffmpegProcess = spawn(command, args);

ffmpegProcess.stdout.on('data', (data) => {
	const output = data.toString();
	console.log(output);
});

ffmpegProcess.stderr.on('data', (data) => {
	const errorOutput = data.toString();
	console.error(errorOutput);
});

ffmpegProcess.on('close', (code) => {
	if (code !== 0) {
		console.log('Error al descargar el video');
		return;
	}

	const endTime = performance.now();
	const duration = intervalToDuration({ start: 0, end: endTime - startTime });
	const formatted = formatDuration(duration);
	console.log(`Duración: ${formatted}`);
	console.log(`FFmpeg finalizado con código ${code}`);
	console.log(pathToFfmpeg);
});

export default downloader;
