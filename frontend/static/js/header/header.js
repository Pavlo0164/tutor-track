import createElement from "../functions/create-element.js"
export class Header {
	constructor(title) {
		this.titleInner = title
		this.el = this.render()
	}
	changeTitle(text) {
		this.title.innerText = text
	}
	changeUserName(name) {
		this.userName.innerText = name
	}
	changeUserEmail(email) {
		this.userEmail.innerText = email
	}
	createUserGroup() {
		const wrap = createElement("div", ["header__group", "user-group"])
		const textWrap = createElement("div", "user-group__user-info")
		this.userName = document.createElement("p")
		this.userEmail = document.createElement("p")
		textWrap.append(this.userName, this.userEmail)
		const imageWrap = createElement("div", [
			"user-group__wrap-image",
			"image-wrap",
		])
		createElement("img", null, { src: "./img/user.svg" }, null, imageWrap)
		wrap.append(textWrap, imageWrap)
		return wrap
	}
	render() {
		const wrap = createElement("header", ["main-content__header", "header"])
		this.title = createElement(
			"h3",
			"header__title",
			null,
			this.titleInner,
			wrap
		)
		wrap.append(this.createUserGroup())
		return wrap
	}
}
