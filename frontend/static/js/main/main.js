import { Aside } from "../aside/aside.js"
import { Header } from "../header/header.js"
import { Home } from "../pages/home/home.js"
import createElement from "../functions/create-element.js"
export class Main {
	constructor() {
		this.header = new Header("Home")
		this.aside = new Aside()
		this.home = new Home()
		this.el = this.render()
	}
	render() {
		const wrapper = createElement("div", "main-wrapper")
		this.mainContent = createElement("div", [
			"main-wrapper__content",
			"main-content",
		])
		this.mainContent.append(this.header.el, this.home.el)
		wrapper.append(this.aside.el, this.mainContent)
		return wrapper
	}
}
