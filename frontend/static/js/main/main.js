import { Aside } from "../aside/aside.js"
import { Header } from "../header/header.js"
import { Home } from "../pages/home/home.js"
export class Main {
	constructor() {
		this.header = new Header("Home")
		this.aside = new Aside()
		this.el = this.render()
	}
	render() {
		const wrapper = document.createElement("div")
		wrapper.classList.add("main-wrapper")
		this.mainContent = document.createElement("div")
		this.mainContent.classList.add("main-content")
		this.mainContent.append(this.header.el, new Home().el)
		wrapper.append(this.aside.el, this.mainContent)
		return wrapper
	}
}
