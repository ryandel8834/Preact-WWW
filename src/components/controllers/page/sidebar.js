import { h } from 'preact';
import style from './sidebar.less';
import DocVersion from './../../doc-version';
import SidebarNav from './sidebar-nav';
import { useCallback } from 'preact/hooks';
import config from '../../../config.json';
import { useStore } from '../../store-adapter';
import { useOverlayToggle } from '../../../lib/toggle-overlay';
import { getRouteName } from '../../header';

export default function Sidebar() {
	const [open, setOpen] = useOverlayToggle(false);
	const toggle = useCallback(() => setOpen(!open), [open]);
	const close = useCallback(() => setOpen(false));
	const { docVersion, lang } = useStore(['docVersion', 'lang']).state;

	// Get menu items for the current version of the docs (guides)
	// TODO: allow multiple sections - config[meta.section]
	const docNav = config.docs
		.filter(item => item.path.indexOf(`/v${docVersion}`) > -1)
		.map(item => ({
			text: getRouteName(item, lang),
			level: 2,
			href: item.path
		}));
	
	// TODO: use URL match instead of .content
	const guide = config.nav.filter(item => item.content === 'guide')[0];
	const sectionName = getRouteName(guide, lang);

	return (
		<div class={style.wrapper} data-open={open}>
			<button class={style.toggle} onClick={toggle} value="sidebar">
				{sectionName}
			</button>
			<aside class={style.sidebar}>
				<div class={style.sidebarInner}>
					<DocVersion />
					<SidebarNav items={docNav} onClick={close} />
				</div>
			</aside>
		</div>
	);
}
