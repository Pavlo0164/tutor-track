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

	validateInput(event) {
		const type = event.target.getAttribute("type");
		if (type === "email") {
			if (this.checkEmail.regExp.test(event.target.value)) {
				this.checkEmail.checked = true;
				this.email.classList.remove("not-valid");
				this.email.classList.add("valid");
			} else {
				this.checkEmail.checked = false;
				this.email.classList.remove("valid");
				this.email.classList.add("not-valid");
			}
		} else if (type === "password") {
			if (this.checkPassword.regExp.test(event.target.value)) {
				this.checkPassword.checked = true;
				this.password.classList.remove("not-valid");
				this.password.classList.add("valid");
			} else {
				this.checkPassword.checked = false;
				this.password.classList.add("not-valid");
				this.password.classList.remove("valid");
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
		this.result = document.createElement("span");

		this[type].addEventListener("input", (e) => this.validateInput(e));
		wrap.append(label, this[type], this.result);
		return wrap;
	}
	createButtons() {
		const wrapButtons = document.createElement("div");
		wrapButtons.className = "buttons-wrapper";
		this.buttonLogin = document.createElement("button");
		this.buttonLogin.innerText = "Login";
		this.buttonRegistr = document.createElement("button");
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
