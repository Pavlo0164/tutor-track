export default class Users {
	constructor() {
		this.el = this.render()
	}

	render() {
		const wrap = document.createElement("div")
		wrap.classList.add("users-block")
		return wrap
	}
}
