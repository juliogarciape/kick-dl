import { Duration } from 'luxon';

export const convertTime = (millis) => {
	const duration = Duration.fromMillis(millis);
	return duration.toFormat("h.mm 'hours'");
};
