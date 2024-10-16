import { spawn } from 'child_process';
import pathToFfmpeg from 'ffmpeg-static';
//import { formatDuration, intervalToDuration } from 'date-fns';

export default async function downloader(urlContent) {
	const args = [
		'-y',
		'-i',
		urlContent,
		'-threads',
		'0',
		'-c',
		'copy',
		'-progress',
		'pipe:1',
		'output.mp4',
	];

	const command = pathToFfmpeg;
	//const ffmpegProcess = spawn(command, args);

	return 'Downloader';
}

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

/* 

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
	const duration = intervalToDuration({ start: 0, end: endTime - startTime });
	const formatted = formatDuration(duration);
	console.log(`Duración: ${formatted}`);
	console.log(`FFmpeg finalizado con código ${code}`);
	console.log(pathToFfmpeg);
});
 */
