export class Auth {
	constructor() {
		this.title = "Auth";
		this.checkEmail = {
			regExp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			checked: false
		};
		this.checkPassword = {
			regExp: /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).*$/,
			checked: false
		};
		this.el = this.render();
	}
	check(tag, removeClassValid, addClassValid, text, { classChange = "result-input", flag = "add" }) {
		this[tag].classList.remove(removeClassValid);
		this[tag].classList.add(addClassValid);
		this[tag].nextElementSibling.innerText = text;
		if (flag === "add") this[tag].nextElementSibling.classList.add(classChange);
		else if (flag === "remove") this[tag].nextElementSibling.classList.remove(classChange);
	}
	checkInput(e) {
		if (!this.checkEmail.checked) {
			this.check("email", "valid", "not-valid", "Wrong email", { flag: "add" });
		}
		if (!this.checkPassword.checked) {
			this.check(
				"password",
				"valid",
				"not-valid",
				"The password must contain at least one capital letter, at least one number, and at least one special character",
				{ flag: "add" }
			);
		}
	}
	validateInput(event) {
		const type = event.target.getAttribute("type");
		if (type === "email") {
			if (this.checkEmail.regExp.test(event.target.value)) {
				this.checkEmail.checked = true;
				this.check("email", "not-valid", "valid", "", { flag: "remove" });
			} else {
				this.checkEmail.checked = false;
				this.check("email", "valid", "not-valid", "Wrong email", { flag: "add" });
			}
		} else if (type === "password") {
			if (this.checkPassword.regExp.test(event.target.value)) {
				this.checkPassword.checked = true;
				this.check("password", "not-valid", "valid", "", { flag: "remove" });
			} else {
				this.checkPassword.checked = false;
				this.check(
					"password",
					"valid",
					"not-valid",
					"The password must contain at least one capital letter, at least one number, and at least one special character",
					{ flag: "add" }
				);
			}
		}
	}
	createInput(labelInner, type) {
		const wrap = document.createElement("div");
		wrap.classList.add("input-wrapper");
		const label = document.createElement("label");
		label.setAttribute("for", "name");
		label.innerText = labelInner;
		this[type] = document.createElement("input");
		this[type].type = type;
		this[type].setAttribute("id", type);
		this[type].setAttribute("placeholder", `Enter ${type}`);
		const result = document.createElement("span");
		this[type].addEventListener("input", (e) => this.validateInput(e));
		wrap.append(label, this[type], result);
		return wrap;
	}
	createButtons() {
		const wrapButtons = document.createElement("div");
		wrapButtons.className = "buttons-wrapper";
		this.buttonLogin = document.createElement("button");
		this.buttonLogin.addEventListener("click", (e) => this.checkInput(e));
		this.buttonLogin.innerText = "Login";
		this.buttonRegistr = document.createElement("button");
		this.buttonRegistr.addEventListener("click", (e) => this.checkInput(e));
		this.buttonRegistr.innerText = "Registration";
		wrapButtons.append(this.buttonLogin, this.buttonRegistr);
		return wrapButtons;
	}
	render() {
		const container = document.createElement("div");
		container.className = "form__wrapper";
		const wrap = document.createElement("div");
		container.append(wrap);
		const title = document.createElement("h2");
		title.innerText = this.title;
		wrap.append(title, this.createInput("Email", "email"), this.createInput("Password", "password"), this.createButtons());
		return container;
	}
}
