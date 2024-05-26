import { Aside } from "../aside/aside.js";
import { Header } from "../header/header.js";
export class Main {
	constructor() {
		this.el = this.render();
	}
	render() {
		const wrapper = document.createElement("div");
		wrapper.classList.add("main-wrapper");

		const mainContent = document.createElement("div");
		mainContent.classList.add("main-content");
		mainContent.appendChild(new Header('Home').el);
		wrapper.append(new Aside().el, mainContent);

		return wrapper;
	}
}
