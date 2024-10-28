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
		const wrap = document.createElement("div")
		wrap.classList.add("user-group")
		const textWrap = document.createElement("div")
		this.userName = document.createElement("p")
		this.userEmail = document.createElement("p")
		textWrap.append(this.userName, this.userEmail)
		const imageWrap = document.createElement("div")
		imageWrap.classList.add("image-wrap")
		const image = document.createElement("img")
		image.setAttribute("src", "./img/user.svg")
		imageWrap.append(image)
		wrap.append(textWrap, imageWrap)
		return wrap
	}
	render() {
		const wrap = document.createElement("header")
		wrap.classList.add("header")
		this.title = document.createElement("h3")
		this.title.innerText = this.titleInner
		wrap.append(this.title, this.createUserGroup())
		return wrap
	}
}
