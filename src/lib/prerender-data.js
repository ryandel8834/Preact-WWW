const TYPE = 'text/pd';

const noop = () => {};

const prerenderNodes = !PRERENDER && document.querySelectorAll(`[type="${TYPE}"]`);
const prerenderData = {};

export function getPrerenderData(name) {
	if (!prerenderNodes) return;
	if (name in prerenderData) return prerenderData[name];
	for (let i=0; i<prerenderNodes.length; i++) {
		if (prerenderNodes[i].getAttribute('data-pd') === name) {
			let data;
			try {
			 data = JSON.parse(prerenderNodes[i].firstChild.data
				.replace(/(^<!--|-->$)/g, '')
				.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
			} catch (e) {}
			return prerenderData[name] = data;
		}
	}
}


export const InjectPrerenderData = PRERENDER ? (
	function InjectPrerenderData({ name, data }) {
		const content = JSON.stringify(data).replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return (
			<script
				type={TYPE}
				data-pd={name}
				dangerouslySetInnerHTML={{
					__html: '<!--' + content + '-->'
				}}
			/>
		);
	}
) : noop;

