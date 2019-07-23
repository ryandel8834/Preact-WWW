import { h, Component } from 'preact';
import cx from '../../../lib/cx';
import style from './table-of-contents.less';

export default class Toc extends Component {
	state = {};

	toggle = () => {
		this.setState({ open: !this.state.open });
		return false;
	};

	open = () => this.setState({ open: true });

	componentDidMount() {
		if ('IntersectionObserver' in window) {
			let config = {
				root: null,
				threshold: 1,
				rootMargin: '0px'
			};

			this.observer = new IntersectionObserver(entries => {
				let active = [];
				entries.forEach(entry => {
					let id = entry.target.getAttribute('id');
					let link = this.props.items.find(link => link.id === id);
					if (link && entry.isIntersecting && entry.intersectionRatio >= 0.75) {
						active.push(id);
					}
				});

				if (active.length > 0) {
					this.setState({ active: active[0] });
				}
			}, config);

			Array.from(
				document.querySelectorAll(
					'content-region h2, content-region h3, content-region h4'
				)
			).forEach(heading => this.observer.observe(heading));
		}
	}

	componentWillUnmount() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	render({ items, onClick }, { open, active }) {
		return (
			<div
				class={cx(style.toc, !(items && items.length > 1) && style.disabled)}
				data-open={open}
			>
				<nav tabIndex="0" onFocus={this.open}>
					{items.map(({ text, level, id }) => {
						let activeCss =
							this.state.active === id ? style.linkActive : undefined;
						return (
							<a
								href={'#' + id}
								onClick={onClick}
								class={cx(style.link, activeCss, style['level-' + level])}
							>
								{text}
							</a>
						);
					})}
				</nav>
			</div>
		);
	}
}
