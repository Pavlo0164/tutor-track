//import { Users } from "../users-coll/users"
export class Pay {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.innerText = "Pay"
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
