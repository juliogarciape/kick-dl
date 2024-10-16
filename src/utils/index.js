import log from '../lib/colors.js';

export const logMessage = (message, color) => {
	return log[color](message);
};

//const customPrefix = logs.green('[*]');
