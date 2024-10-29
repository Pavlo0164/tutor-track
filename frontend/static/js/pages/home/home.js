import createElement from "../../functions/create-element.js"
export class Home {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = createElement("div", null, { "data-content": "" }, "`home")
		return wrap
	}
}
