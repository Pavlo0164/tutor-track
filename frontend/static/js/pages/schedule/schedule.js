export class Schedule {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.innerText = "Schedule"
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
