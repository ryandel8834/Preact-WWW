import marked from 'marked';

export function convert(markdown) {
	return marked(markdown);
}
