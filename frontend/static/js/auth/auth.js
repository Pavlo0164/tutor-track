import { URL } from "../config/config.js"
import createElement from "../functions/create-element.js"
export class Auth {
	constructor() {
		this.title = "Auth"
		this.checkEmail = {
			regExp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			checked: false,
		}
		this.checkPassword = {
			regExp: /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).*$/,
			checked: false,
		}
		this.el = this.render()
	}
	check(
		tag,
		removeClassValid,
		addClassValid,
		text,
		{ flag = "add", classChange = "result-input" }
	) {
		this[tag].classList.remove(removeClassValid)
		this[tag].classList.add(addClassValid)
		this[tag].nextElementSibling.innerText = text
		if (flag === "add") this[tag].nextElementSibling.classList.add(classChange)
		else if (flag === "remove")
			this[tag].nextElementSibling.classList.remove(classChange)
	}
	checkInput(e) {
		let count = 2
		if (this.checkEmail.checked)
			this.check("email", "not-valid", "valid", "", { flag: "remove" })
		else {
			this.check("email", "valid", "not-valid", "Wrong email", {
				flag: "add",
			})
			count--
		}
		if (this.checkPassword.checked)
			this.check("password", "not-valid", "valid", "", { flag: "remove" })
		else {
			this.check(
				"password",
				"valid",
				"not-valid",
				"The password must contain at least one capital letter, at least one number, and at least one special character",
				{ flag: "add" }
			)
			count--
		}
		return count
	}
	validateInput(event) {
		const type = event.target.getAttribute("type")
		if (type === "email") {
			if (this.checkEmail.regExp.test(event.target.value))
				this.checkEmail.checked = true
			else this.checkEmail.checked = false
		} else if (type === "password") {
			if (this.checkPassword.regExp.test(event.target.value))
				this.checkPassword.checked = true
			else this.checkPassword.checked = false
		}
	}
	createInput(labelInner, type) {
		const wrap = createElement("div", ["form__wrapper-input", "input-wrapper"])
		createElement("label", null, { for: type }, labelInner, wrap)
		this[type] = createElement(
			"input",
			null,
			{
				type: type,
				id: type,
				placeholder: `Enter ${type}`,
			},
			null,
			wrap
		)
		const result = document.createElement("span")
		wrap.append(result)
		this[type].addEventListener("input", (e) => this.validateInput(e))
		return wrap
	}
	async login() {
		try {
			this.resultErr.innerText = ""
			this.spinner.classList.add("active-spinner")
			const user = {
				email: this.email.value,
				password: this.password.value,
			}
			const reg = await fetch(URL + "/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			})
			this.spinner.classList.remove("active-spinner")
			if (reg.status === 401) {
				const result = await reg.json()
				this.resultErr.innerText = result.message
				return
			}
			if (reg.ok) {
				const result = await reg.json()
				localStorage.setItem("id", result.id)
				this.el.dispatchEvent(
					new CustomEvent("register", {
						bubbles: true,
					})
				)
			}
		} catch (error) {
			console.error(error.message)
		}
	}
	async register() {
		try {
			this.spinner.classList.add("active-spinner")
			this.resultErr.innerText = ""
			const user = {
				email: this.email.value,
				password: this.password.value,
			}
			const reg = await fetch(URL + "/registr", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			})
			this.spinner.classList.remove("active-spinner")
			if (reg.status === 401) {
				const result = await reg.json()
				this.resultErr.innerText = result.message
				return
			}
			if (reg.ok) {
				const result = await reg.json()
				localStorage.setItem("id", result.id)
				this.el.dispatchEvent(
					new CustomEvent("register", {
						bubbles: true,
					})
				)
			}
		} catch (error) {
			console.error(error)
			this.resultErr.innerText = error.message
		}
	}
	async eventLogin(e) {
		this.buttonLogin.dispatchEvent(
			new CustomEvent("updateActiveButton", { bubbles: true })
		)
		try {
			this.validateInput(e)
			const resValidate = this.checkInput(e)
			if (resValidate === 2) await this.login()
		} catch (error) {
			console.error(error)
		}
	}
	async eventRegistr(e) {
		this.buttonRegistr.dispatchEvent(
			new CustomEvent("updateActiveButton", { bubbles: true })
		)
		try {
			this.validateInput(e)
			const resValidate = this.checkInput(e)
			if (resValidate === 2) await this.register()
		} catch (error) {
			console.error(error)
		}
	}
	createButtons() {
		const wrapButtons = createElement("div", [
			"form__wrapper-buttons",
			"buttons-wrapper",
		])
		this.buttonLogin = createElement("button", null, null, "Login", wrapButtons)
		this.buttonRegistr = createElement(
			"button",
			null,
			null,
			"Registration",
			wrapButtons
		)
		this.buttonLogin.addEventListener(
			"click",
			async (e) => await this.eventLogin(e)
		)
		this.buttonRegistr.addEventListener(
			"click",
			async (e) => await this.eventRegistr(e)
		)
		return wrapButtons
	}
	createSpinner() {
		this.spinner = createElement("div", ["form__spinner", "login-spinner"])
		createElement(
			"span",
			["login-spinner__span", "span-spinner"],
			null,
			null,
			this.spinner
		)
		return this.spinner
	}
	render() {
		const container = createElement("div", "form__wrapper")
		const wrap = createElement("div", "form", null, null, container)
		createElement("h2", "form__title", null, this.title, wrap)
		this.resultErr = createElement("p", ["form__err", "result-err"])
		wrap.append(
			this.createInput("Email", "email"),
			this.createInput("Password", "password"),
			this.resultErr,
			this.createButtons(),
			this.createSpinner()
		)
		return container
	}
}
