//import { Users } from "../users/users"
export class Data {
	constructor() {
		this.el = this.render()
	}

	render() {
		const wrap = document.createElement("div")
		wrap.innerText = "Data"
		wrap.append(new Users().el)
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
