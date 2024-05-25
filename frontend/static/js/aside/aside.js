export class Aside {
	constructor() {
		this.el = this.render();
	}
	changeHref(href) {
		history.pushState(null, null, href);
		this.route();
	}
	async route() {
		const routes = [
			{
				path: "/",
				view: () => console.log("/")
			},
			{
				path: "/dashboard",
				view: () => console.log("/dashboard")
			},
			{
				path: "/settings",
				view: () => console.log("/settings")
			}
		];
		const activeWindow = routes.map((route) => {
			return {
				route: route,
				isActive: route.path === location.pathname
			};
		});
		let searchLink = activeWindow.find((item) => item.isActive);
		if (!searchLink) searchLink = { route: routes[0], isActive: true };
		searchLink.route.view();
	}
	createLink(ref, inner) {
		const link = document.createElement("a");
		link.setAttribute("href", ref);
		link.setAttribute("data-link", "");
		link.innerText = inner;
		link.classList.add("menu__link");
		return link;
	}
	routeToPage(e) {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			this.changeHref(e.target.href);
		}
	}
	render() {
		const wrap = document.createElement("div");
		wrap.classList.add("aside");
		wrap.addEventListener("click", (e) => this.routeToPage(e));
		const nav = document.createElement("nav");
		nav.className = "aside__menu menu";
		wrap.append(nav);
		nav.append(this.createLink("/", "Home"), this.createLink("/dashboard", "Dashboard"), this.createLink("/settings", "Settings"));
		return wrap;
	}
}
