import Users from "../users/users.js"
import UserData from "./users-data.js"
import createElement from "../../functions/create-element.js"
export class Data {
	constructor() {
		this.el = this.render()
	}
	render() {
		this.wrap = createElement("div", ["main-content__users", "users-content"], {
			"data-content": "",
		})
		this.wrap.addEventListener("checkUserData", (e) => {
			this.userData = new UserData()
			this.wrap.lastElementChild.remove()
			this.wrap.append(this.userData.el)
		})
		this.wrap.addEventListener("deleteStudent", (e) => {
			this.wrap.firstElementChild.remove()
			this.wrap.lastElementChild.remove()
			this.userData = new UserData()
			this.wrap.append(new Users().el, this.userData.el)
		})
		this.wrap.addEventListener("firstStudent", (e) => {
			this.wrap.lastElementChild.remove()
			this.userData = new UserData()
			this.wrap.append(this.userData.el)
		})
		this.userData = new UserData()
		this.wrap.append(new Users().el, this.userData.el)

		return this.wrap
	}
}
