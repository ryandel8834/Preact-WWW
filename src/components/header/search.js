import { createRef, Component } from 'preact';
import style from './style.module.less';
import config from '../../config.json';
import { lazily, cancelLazily } from '../../lib/lazily';

let docsearchInstance;

export default class Search extends Component {
	id = 'docsearch-input';

	input = createRef();

	load = () => {
		this.lazy = lazily(() => {
			if (window.docsearch) return;

			let head = document.head || document.querySelector('head');

			let link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css';
			head.appendChild(link);

			let script = document.createElement('script');
			script.async = true;
			script.src = 'https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js';
			script.onload = script.onerror = this.loaded;
			head.appendChild(script);
		});
	};

	loaded = () => {
		let docsearch = window.docsearch;
		if (docsearch && !docsearchInstance) {
			this.lazy = lazily(() => {
				const parent = document.createElement('span');
				parent.style.position = 'relative';
				parent.id = 'alsearch';
				document.body.appendChild(parent);
				docsearchInstance = docsearch({
					apiKey: config.docsearch.apiKey,
					indexName: config.docsearch.indexName,
					inputSelector: this.input.current,
					autocompleteOptions: {
						dropdownMenuContainer: '#alsearch'
					}
				});
			});
		}
	};

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		if (!docsearchInstance) {
			this.load();
		}
	}

	componentWillUnmount() {
		cancelLazily(this.lazy);
	}

	render() {
		return (
			<div class={style.search}>
				<label aria-label="Search">
					<input
						ref={this.input}
						id={this.id}
						class={style.searchBox}
						required
					/>
				</label>
			</div>
		);
	}
}
