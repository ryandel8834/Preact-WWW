import { checkStatus } from './request';

function memoize(fn) {
	const CACHE = {};
	return key => CACHE[key] || (CACHE[key] = fn(key));
}

// TODO: use GraphQL to avoid fetching so much data
export const repoInfo = memoize(repo =>
	fetch(`https://api.github.com/repos/${repo}`)
		.then(checkStatus)
		.then(r => r.json())
		.catch(() => ({
			stargazers_count: 9999,
			watchers_count: 9999
		}))
);
