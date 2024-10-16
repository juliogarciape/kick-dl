import { Duration } from 'luxon';

export const formatInput = (input) => {
	return input.toLowerCase().replace(/\s+/g, '_');
};

export const convertTime = (millis) => {
	const duration = Duration.fromMillis(millis);
	return duration.toFormat("h.mm 'hours'");
};
