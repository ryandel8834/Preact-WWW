import 'promise-polyfill/lib/polyfill';

if (!Uint8Array.prototype.slice) {
	Uint8Array.prototype.slice = function (begin, end) {
		return new Uint8Array([].slice.call(this, begin, end));
	};
}

function includes(needle) {
	return this.indexOf(needle) !== -1;
}

if (!String.prototype.includes) {
	String.prototype.includes = includes;
}

if (!Array.prototype.includes) {
	Array.prototype.includes = includes;
}

if (!Object.keys) {
	Object.keys = function(obj) {
		const keys = [];
		for (const i in obj) keys.push(i);
		return keys;
	};
}

if (!Object.entries) {
	Object.entries = function(obj) {
		const entries = [];
		for (const i in obj) {
			entries.push([i, obj[i]]);
		}
		return entries;
	};
}
