export class Header {
	#titleInner;
	constructor(title) {
		this.el = this.render();
		this.TitleInner = title;
	}
	get titleInner() {
		return this.#titleInner;
	}
	set TitleInner(title) {
		this.#titleInner = title;
		this.title.innerText = title;
	}
	render() {
		const wrap = document.createElement("header");
		wrap.classList.add("header");

		this.title = document.createElement("h3");
		this.title.innerText = this.TitleInner;
		wrap.append(this.title);

		return wrap;
	}
}
