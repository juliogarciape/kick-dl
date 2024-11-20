import { Duration } from 'luxon';
import log from '../lib/colors.js';
import { formatInput } from '../helpers/index.js';

export const logMessage = (message, color) => {
	return log[color](message);
};

export const channelTransformer = (input) => {
	const formatedText = formatInput(input);
	return logMessage(formatedText, 'pink');
};

export const confirmTransformer = (input) => {
	if (input) {
		return logMessage('Yes', 'green');
	}

	return logMessage('Canceled', 'red');
};

export const convertTime = (millis) => {
	const duration = Duration.fromMillis(millis);
	return duration.toFormat("h.mm 'hours'");
};
