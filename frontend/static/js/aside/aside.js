export class Aside {
	constructor() {
		this.el = this.render();
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
	render() {
		const wrap = document.createElement("div");
		wrap.classList.add("aside");
		const title = document.createElement("h1");
		title.classList.add("main-title");
		const exit = document.createElement("button");
		exit.classList.add("exit-button");

		const span = document.createElement("span");
		exit.addEventListener("click", (e) => {
			localStorage.removeItem("id");
			this.el.dispatchEvent(new CustomEvent("exit", { bubbles: true }));
		});
		exit.innerText = "Exit";
		exit.prepend(span);
		const nav = document.createElement("nav");
		nav.className = "aside__menu menu";
		nav.append(
			this.createLink("/", "Home", "link-home"),
			this.createLink("/data", "Data", "link-data"),
			this.createLink("/pay", "Pay", "link-pay"),
			this.createLink("/schedule", "Schedule", "link-schedule"),
			this.createLink("/plan", "Plan", "link-plan"),
			this.createLink("/settings", "Settings", "link-settings")
		);

		const footerText = document.createElement("div");
		footerText.classList.add("footer-text");
		footerText.innerText = `2024 @ With love from `;

		const span2 = document.createElement("span");
		span2.innerText = "Pavlo and Anna";
		footerText.append(span2);
		wrap.append(title, nav, exit, footerText);
		return wrap;
	}
}
