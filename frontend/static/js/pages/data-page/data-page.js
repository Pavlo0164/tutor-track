export class Data {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.innerText = "Data"
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
