import { logMessage } from './index.js';

export const formatInput = (input) => input.toLowerCase().replace(/\s+/g, '_');

export const customTransformer = (input, { isFinal }) => {
	if (isFinal) {
		const formatedText = formatInput(input);
		return logMessage(formatedText, 'pink');
	}
	return logMessage(input, 'pink');
};
