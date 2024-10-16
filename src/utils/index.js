import log from '../lib/colors.js';
import { convertTime, formatInput } from '../helpers/index.js';

export const logMessage = (message, color) => {
	return log[color](message);
};

export const customTransformer = (input, { isFinal }) => {
	if (isFinal) {
		const formatedText = formatInput(input);
		return logMessage(formatedText, 'pink');
	}
	return logMessage(input, 'pink');
};

export const aea = (contentList, contentType) => {
	return contentList.map((content) => {
		const hours = convertTime(content.duration);

		return {
			name:
				contentType === 'vod'
					? `${content.session_title} - ${hours} - ${content.start_time}`
					: `${content.title} - ${content.duration} seconds`,
			value: contentType === 'vod' ? content.source : content.clip_url,
			description:
				contentType === 'vod'
					? `- Description: ${content.session_title} | ${content.categories[0].name} | ${content.views} views`
					: `- Description: ${content.title} | ${content.category.name} | ${content.views} views`,
		};
	});
};
