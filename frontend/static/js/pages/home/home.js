export class Home {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.innerText = "Home"
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
