import fetch from 'node-fetch';

exports.handler = async event => {
	const result = await repoInfo(
		event.queryStringParameters.repo || 'preactjs/preact'
	);
	return {
		statusCode: 200,
		body: JSON.stringify(result)
	};
};

function checkStatus(r) {
	if (!r.ok) {
		throw new Error(`${r.status}: Request failed for '${r.url}'`);
	}

	return r;
}

const repoInfo = repo =>
	fetch(`https://api.github.com/repos/${repo}`)
		.then(checkStatus)
		.then(r => r.json());
