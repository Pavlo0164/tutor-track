import Users from "../users/users.js"
export class Pay {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.append(new Users().el)
		wrap.classList.add("users-content")
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
