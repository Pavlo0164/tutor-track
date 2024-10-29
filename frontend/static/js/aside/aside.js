import createElement from "../functions/create-element.js"
export class Aside {
	constructor() {
		this.el = this.render()
	}
	createLink(ref, inner, classAdd, classActive = null) {
		const link = createElement(
			"a",
			"menu__link",
			{
				href: ref,
				"data-link": "",
			},
			inner
		)
		if (classActive) link.classList.add(classActive)
		link.classList.add(classAdd)
		return link
	}
	addClassToHome() {
		const homeButton = this.el.querySelector(".link-home")
		homeButton.classList.add("active-page")
	}
	render() {
		const wrap = createElement("div", ["main-wrapper__aside", "aside"])
		createElement("h1", ["aside__title", "main-title"], null, null, wrap)
		this.nav = createElement("nav", ["aside__menu", "menu"], null, null, wrap)
		this.nav.addEventListener("click", (e) => {
			const links = Array.from(this.nav.children)
			if (e.target.classList.contains("menu__link")) {
				links.forEach((el) => el.classList.remove("active-page"))
				e.target.classList.add("active-page")
			}
		})
		this.nav.append(
			this.createLink("/home", "Home", "link-home"),
			this.createLink("/data", "Data", "link-data"),
			this.createLink("/pay", "Pay", "link-pay"),
			this.createLink("/schedule", "Schedule", "link-schedule"),
			this.createLink("/plan", "Plan", "link-plan"),
			this.createLink("/settings", "Settings", "link-settings")
		)
		const exit = createElement(
			"button",
			["aside__exit-button", "exit-button"],
			null,
			"Exit",
			wrap
		)
		exit.addEventListener("click", (e) => {
			const links = Array.from(this.nav.children)
			links.forEach((el) => el.classList.remove("active-page"))
			localStorage.removeItem("id")
			this.el.dispatchEvent(new CustomEvent("exit", { bubbles: true }))
		})
		createElement(
			"span",
			null,
			null,
			"Pavlo and Anna",
			createElement(
				"div",
				["aside__footer", "footer-text"],
				null,
				"2024 @ With love from",
				wrap
			)
		)
		const links = Array.from(this.nav.children)
		links.forEach((el) => {
			if (el.getAttribute("href") === location.pathname)
				el.classList.add("active-page")
			else el.classList.remove("active-page")
		})
		return wrap
	}
}
