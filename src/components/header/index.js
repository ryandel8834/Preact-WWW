import { h, Component } from 'preact';
import { Link } from 'preact-router';
import cx from 'classnames';
import Logo from '../logo';
import style from './style';
import config from '../../config';


const LINK_FLAIR = {
	logo: () => <Logo inverted />
};


export default class Header extends Component {
	state = { open:false };

	toggle = () => this.setState({ open: !this.state.open });

	// close menu on navigate
	componentWillReceiveProps({ url }) {
		if (url!==this.props.url && this.state.open) {
			this.setState({ open:false });
		}
	}

	render({ url }, { open }) {
		return (
			<header class={cx(style.header, open && style.open)}>
				<Hamburgler open={open} onClick={this.toggle} />
				<Nav routes={config.nav} current={url} />
			</header>
		);
	}
}


// hamburgler menu
const Hamburgler = ({ open, ...props }) => (
	<div class={style.hamburgler} open={open} {...props}>
		<div class={style.hb1} />
		<div class={style.hb2} />
		<div class={style.hb3} />
	</div>
);


// nested nav renderer
const Nav = ({ routes, current, ...props }) => (
	<nav {...props}>
		{ routes.map( route => (
			<NavItem
				to={route}
				current={current}
				route={getRouteIdent(route)}
				class={cx(route.class, route.path===current && style.current)}
			/>
		)) }
	</nav>
);


// nav items are really the only complex bit for menuing, since they handle click events.
class NavItem extends Component {
	state = { open:false };

	close = () => (this.setState({ open:false }), false);

	toggle = () => (this.setState({ open: !this.state.open }), false);

	constructor() {
		super();
		addEventListener('click', ({ target }) => {
			do {
				if (target===this.base) return;
			} while ((target=target.parentNode));
			this.close();
		});
	}

	componentDidUpdate({ current }) {
		if (current!==this.props.current && this.state.open) {
			this.close();
		}
	}

	render({ to, current, ...props }, { open }) {
		if (!to.routes) return (
			<NavLink to={to} {...props} />
		);

		return (
			<section {...props} open={open}>
				<NavLink to={to} onClick={this.toggle} aria-haspopup />
				<Nav routes={to.routes} current={current} aria-label="submenu" aria-hidden={''+!open} />
			</section>
		);
	}
}


// depending on the type of nav link, use <Link> or <a>
const NavLink = ({ to, ...props }) => {
	let LinkImpl = to.path ? Link : 'a';
	return (
		<LinkImpl href={to.path || 'javascript:'} {...props}>
			{ to.flair && LINK_FLAIR[to.flair] && LINK_FLAIR[to.flair]() }
			{ to.name || to.title }
		</LinkImpl>
	);
};


// get a CSS-addressable identifier for a given route
const getRouteIdent = route => (
	(route.name || route.title || route.url).toLowerCase().replace(/[^a-z0-9]/i,'')
);
