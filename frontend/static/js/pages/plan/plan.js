//import { Users } from "../users-coll/users"
export class Plan {
	constructor() {
		this.el = this.render()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.innerText = "Plan"
		wrap.setAttribute("data-content", "")
		return wrap
	}
}
