export class Aside {
	constructor() {
		this.el = this.render()
	}
	createLink(ref, inner, classAdd, classActive = null) {
		const link = document.createElement("a")
		link.setAttribute("href", ref)
		link.setAttribute("data-link", "")
		link.innerText = inner
		if (classActive) link.classList.add(classActive)
		link.classList.add("menu__link")
		link.classList.add(classAdd)
		return link
	}
	addClassToHome() {
		const homeButton = this.el.querySelector(".link-home")
		homeButton.classList.add("active-page")
	}
	render() {
		const wrap = document.createElement("div")
		wrap.classList.add("aside")
		const title = document.createElement("h1")
		title.classList.add("main-title")
		const exit = document.createElement("button")
		exit.classList.add("exit-button")
		exit.addEventListener("click", (e) => {
			const links = Array.from(this.nav.children)
			links.forEach((el) => el.classList.remove("active-page"))
		})
		const span = document.createElement("span")
		exit.addEventListener("click", (e) => {
			localStorage.removeItem("id")
			this.el.dispatchEvent(new CustomEvent("exit", { bubbles: true }))
		})
		exit.innerText = "Exit"
		exit.prepend(span)
		this.nav = document.createElement("nav")
		this.nav.className = "aside__menu menu"

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
		const footerText = document.createElement("div")
		footerText.classList.add("footer-text")
		footerText.innerText = `2024 @ With love from `
		const span2 = document.createElement("span")
		span2.innerText = "Pavlo and Anna"
		footerText.append(span2)
		wrap.append(title, this.nav, exit, footerText)

		const links = Array.from(this.nav.children)
		links.forEach((el) => {
			if (el.getAttribute("href") === location.pathname)
				el.classList.add("active-page")
			else el.classList.remove("active-page")
		})

		return wrap
	}
}
