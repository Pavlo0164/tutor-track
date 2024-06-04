import Users from "../users/users.js"
export class Data {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.classList.add("users-content")
		wrap.append(new Users().el)
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
