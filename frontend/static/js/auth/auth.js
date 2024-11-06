import { URL } from "../config/config.js"
import createElement from "../functions/create-element.js"
export class Auth {
	constructor(title, type) {
		this.type = type
		this.title = title
		this.checkUsername = {
			regExp: /^(?![0-9])[A-Za-z0-9_-]{3,20}$/,
			checked: false,
		}
		this.checkEmail = {
			regExp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			checked: false,
		}
		this.checkPassword = {
			regExp: /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).*$/,
			checked: false,
		}
		this.checkDoublPassword = {
			checked: false,
		}
		this.el = this.render()
	}

	check(
		type,
		errText,
		tag,
		removeClassValid = type ? "not-valid" : "valid",
		addClassValid = type ? "valid" : "not-valid",
		flag = type ? "remove" : "add",
		classChange = "result-input",
		text = type ? "" : errText
	) {
		this[tag].classList.remove(removeClassValid)
		this[tag].classList.add(addClassValid)
		this[tag].nextElementSibling.innerText = text
		if (flag === "add") this[tag].nextElementSibling.classList.add(classChange)
		else if (flag === "remove")
			this[tag].nextElementSibling.classList.remove(classChange)
		return type
	}
	checkInput(e, type) {
		let count
		if (type === "log") count = 2
		else if (type === "reg") count = 4
		count = this.check(this.checkEmail.checked, "Wrong email", "email")
			? count
			: --count
		let passwordMessage =
			"The password must contain at least one capital letter, at least one number, and at least one special character"
		count = this.check(this.checkPassword.checked, passwordMessage, "password")
			? count
			: --count
		if (type === "reg") {
			count = this.check(
				this.checkUsername.checked,
				"Wrong user name",
				"username"
			)
				? count
				: --count

			count = this.check(
				this.checkDoublPassword.checked,
				passwordMessage,
				"confirmPassword"
			)
				? count
				: --count
		}
		return count
	}
	validateInput(event) {
		const type = event.target.getAttribute("id")
		if (type === "email") {
			if (this.checkEmail.regExp.test(event.target.value))
				this.checkEmail.checked = true
			else this.checkEmail.checked = false
		} else if (type === "password") {
			if (this.checkPassword.regExp.test(event.target.value))
				this.checkPassword.checked = true
			else this.checkPassword.checked = false
		} else if (type === "username") {
			if (this.checkUsername.regExp.test(event.target.value))
				this.checkUsername.checked = true
			else this.checkUsername.checked = false
		} else if (type === "password-doubl") {
			if (this.checkPassword.regExp.test(event.target.value))
				this.checkDoublPassword.checked = true
			else this.checkDoublPassword.checked = false
		}
	}
	async login() {
		try {
			this.resultErr.innerText = ""
			this.spinner.classList.add("active-spinner")
			const user = {
				email: this.email.value,
				password: this.password.value,
			}
			const reg = await fetch(URL + "/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			})
			this.spinner.classList.remove("active-spinner")
			const result = await reg.json()
			if (reg.status === 401) {
				this.resultErr.innerText = result.message
				return
			}
			if (reg.ok) {
				sessionStorage.setItem("accessToken", result.accessToken)
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
				username: this.username.value,
				email: this.email.value,
				password: this.password.value,
				confirmPassword: this.confirmPassword.value,
			}
			const reg = await fetch(URL + "/auth/registr", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			})
			this.spinner.classList.remove("active-spinner")
			const result = await reg.json()
			if (reg.status === 401) {
				this.resultErr.innerText = result.message
				return
			}
			if (reg.ok) {
				sessionStorage.setItem("accessToken", result.accessToken)
				this.el.dispatchEvent(
					new CustomEvent("register", {
						bubbles: true,
					})
				)
			}
		} catch (error) {
			console.log(error.message)
			this.resultErr.innerText = error.message
		}
	}
	async eventLoginOrRegistr(e, type) {
		this.validateInput(e)
		const resValidate = this.checkInput(e, type)
		if (resValidate !== 2 && type === "log") return
		else if (resValidate !== 4 && type === "reg") return
		try {
			if (type === "log") {
				this.buttonLogin.dispatchEvent(
					new CustomEvent("updateActiveButton", { bubbles: true })
				)
				await this.login()
			}
			if (type === "reg") {
				this.buttonRegistr.dispatchEvent(
					new CustomEvent("updateActiveButton", { bubbles: true })
				)
				await this.register()
			}
		} catch (error) {
			console.error(error)
		}
	}

	createButtons(type) {
		const wrapButtons = createElement("div", [
			"form__wrapper-buttons",
			"buttons-wrapper",
		])
		if (type === "log") {
			this.buttonLogin = createElement(
				"button",
				null,
				null,
				"Login",
				wrapButtons
			)

			this.buttonLogin.addEventListener("click", async (e) => {
				try {
					await this.eventLoginOrRegistr(e, "log")
				} catch (err) {
					console.log(err.message)
				}
			})
		} else if (type === "reg") {
			this.buttonRegistr = createElement(
				"button",
				null,
				null,
				"Sign Up",
				wrapButtons
			)
			this.buttonRegistr.addEventListener("click", async (e) => {
				try {
					await this.eventLoginOrRegistr(e, "reg")
				} catch (err) {
					console.log(err)
				}
			})
		}
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
	createInput(labelInner, type, id, name) {
		const wrap = createElement("div", ["form__wrapper-input", "input-wrapper"])
		createElement("label", null, { for: id || type }, labelInner, wrap)
		const input = (this[name] = createElement(
			"input",
			null,
			{
				type: type,
				id: id || type,
				placeholder: `Enter ${type}`,
			},
			null,
			wrap
		))

		const result = document.createElement("span")
		wrap.append(result)
		this[name].addEventListener("input", (e) => this.validateInput(e))
		return wrap
	}
	render() {
		const container = createElement("div", "form__wrapper")
		this.wrap = createElement("div", "form", null, null, container)
		createElement("h2", "form__title", null, this.title, this.wrap)
		this.resultErr = createElement("p", ["form__err", "result-err"])

		if (this.type === "log") {
			this.forgotPassword = createElement(
				"a",
				"form__forgot-password",
				{ href: "/#" },
				"Forgot Password?"
			)
			const goSignUP = createElement(
				"div",
				"form__go-to-sign-up",
				null,
				"New to Tutor Track?"
			)
			const linkGoSignUp = createElement(
				"a",
				"form__link-sign-up",
				{
					href: "/signUp",
				},
				"Create an account",
				goSignUP
			)
			this.wrap.append(
				this.createInput("Email", "email", null, "email"),
				this.createInput("Password", "password", null, "password"),
				this.resultErr,
				this.createButtons(this.type),
				this.forgotPassword,
				createElement("div", "form__underline"),
				goSignUP,
				this.createSpinner()
			)
		} else if (this.type === "reg") {
			const goToLogin = createElement(
				"div",
				"form__go-to-login",
				null,
				"Already have an account?"
			)
			const linkGoToLogin = createElement(
				"a",
				"form__link-to-login",
				{ href: "/login" },
				"Sign in",
				goToLogin
			)
			this.wrap.append(
				this.createInput("Username", "text", "username", "username"),
				this.createInput("Email", "email", null, "email"),
				this.createInput("Password", "password", null, "password"),
				this.createInput(
					"Confirm Password",
					"password",
					"password-doubl",
					"confirmPassword"
				),
				this.resultErr,
				this.createButtons(this.type),
				createElement("div", "form__underline"),
				goToLogin,
				this.createSpinner()
			)
		}

		return container
	}
}
