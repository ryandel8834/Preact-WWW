import { h, Component } from 'preact';
import { Provider } from 'unistore/preact';
import createStore from '../store';
import Routes from './routes';
import Header from './header';
import { storeCtx } from './store-adapter';
import { getCurrentDocVersion } from '../lib/docs';

/*global ga*/

let store = createStore({
	url: location.pathname,
	lang: '',
	docVersion: getCurrentDocVersion(location.pathname)
});

export default class App extends Component {
	handleUrlChange({ url }) {
		let prev = store.getState().url || '/';
		if (url !== prev && typeof ga === 'function') {
			store.setState({ url, docVersion: getCurrentDocVersion(url) });
			ga('send', 'pageview', url);
		}
	}

	render() {
		let url = store.getState().url;
		return (
			<Provider store={store}>
				<storeCtx.Provider value={store}>
					<div id="app">
						<Header url={url} />
						<Routes url={url} onChange={this.handleUrlChange} />
					</div>
				</storeCtx.Provider>
			</Provider>
		);
	}
}
