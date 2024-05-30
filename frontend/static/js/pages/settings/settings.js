export class Settings {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.innerText = "Settings"
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
