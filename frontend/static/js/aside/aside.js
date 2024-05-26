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
				path: "/data",
				view: () => console.log("/data")
			},
			{
				path: "/pay",
				view: () => console.log("/pay")
			},
			{
				path: "/schedule",
				view: () => console.log("/schedule")
			},
			{
				path: "/plan",
				view: () => console.log("/plan")
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
	createLink(ref, inner, classAdd) {
		const link = document.createElement("a");
		link.setAttribute("href", ref);
		link.setAttribute("data-link", "");
		link.innerText = inner;
		link.classList.add("menu__link");
		link.classList.add(classAdd);
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

		const title = document.createElement("h1");

		title.classList.add("main-title");

		const exit = document.createElement("button");
		exit.classList.add("exit-button");
		const span = document.createElement("span");
		exit.innerText = "Exit";
		exit.prepend(span);

		const nav = document.createElement("nav");
		nav.className = "aside__menu menu";
		wrap.append(title, nav, exit);
		nav.append(
			this.createLink("/", "Home", "link-home"),
			this.createLink("/data", "Data", "link-data"),
			this.createLink("/pay", "Pay", "link-pay"),
			this.createLink("/schedule", "Schedule", "link-schedule"),
			this.createLink("/plan", "Plan", "link-plan"),
			this.createLink("/settings", "Settings", "link-settings")
		);
		return wrap;
	}
}
