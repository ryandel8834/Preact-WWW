import { h, Component } from 'preact';
import cx from '../../../lib/cx';
import ContentRegion from '../../content-region';
import config from '../../../config';
import style from './style';

const EMPTY = {};

const getContent = route => route.content || route.path;

export default class Page extends Component {
	componentWillReceiveProps({ route }) {
		if (getContent(route)!==getContent(this.props.route)) {
			this.setState({ loading:true });
		}
	}

	componentDidMount() {
		this.setTitle();
	}

	componentDidUpdate() {
		this.setTitle();
	}

	setTitle() {
		let { props, state } = this,
			title = state.meta && state.meta.title || props.route.title || '';
		document.title = `${title} | ${config.title}`;
	}

	onLoad = ({ meta }) => {
		this.setState({
			current: getContent(this.props.route),
			meta,
			loading: false
		});
		// content was loaded. if this was a forward route transition, animate back to top
		if (window.nextStateToTop) {
			window.nextStateToTop = false;
			scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
		}
	};

	render({ route }, { current, loading, meta=EMPTY, toc }) {
		let layout = `${meta.layout || 'default'}Layout`,
			name = getContent(route);
		if (name!==current) loading = true;
		return (
			<div class={cx(style.page, style[layout])}>
				<progress-bar showing={loading} />
				{ name!='index' && meta.show_title!==false && (
					<h1 class={style.title}>{ meta.title || route.title }</h1>
				) }
				{ toc && meta.toc!==false && (
					<Toc items={toc} />
				) }
				<div class={style.inner}>
					<ContentRegion
						name={name}
						onToc={this.linkState('toc', 'toc')}
						onLoad={this.onLoad}
					/>
				</div>
			</div>
		);
	}
}


class Toc extends Component {
	toggle = e => {
		this.setState({ open: !this.state.open });
		return false;
	};

	open = () => this.setState({open:true});

	render({ items }, { open }) {
		return (
			<div class={cx(style.toc, !(items && items.length>1) && style.disabled)} open={open}>
				<a class={style.toggle} onClick={this.toggle} title="Table of Contents">🔗</a>
				<nav tabIndex="0" onFocus={this.open}>
					{ items.map( ({ text, level, id }) => (
						<a href={'#' + id}>{ text }</a>
					)) }
				</nav>
			</div>
		);
	}
}
