import { Aside } from "../aside/aside.js";
import { Header } from "../header/header.js";
export class Main {
	constructor() {
		this.header = new Header("Home");
		this.aside = new Aside();
		this.el = this.render();
	}
	render() {
		const wrapper = document.createElement("div");
		wrapper.classList.add("main-wrapper");


        
		const mainContent = document.createElement("div");
		mainContent.classList.add("main-content");
		mainContent.append(this.header.el);


		wrapper.append(this.aside.el, mainContent);
		return wrapper;
	}
}
