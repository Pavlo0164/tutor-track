import { URL } from "../config/config.js";
export class Auth {
  constructor() {
    this.title = "Auth";
    this.checkEmail = {
      regExp: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      checked: false,
    };
    this.checkPassword = {
      regExp: /^(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).*$/,
      checked: false,
    };
    this.el = this.render();
  }
  check(
    tag,
    removeClassValid,
    addClassValid,
    text,
    { flag = "add", classChange = "result-input" }
  ) {
    this[tag].classList.remove(removeClassValid);
    this[tag].classList.add(addClassValid);
    this[tag].nextElementSibling.innerText = text;
    if (flag === "add") this[tag].nextElementSibling.classList.add(classChange);
    else if (flag === "remove")
      this[tag].nextElementSibling.classList.remove(classChange);
  }
  checkInput(e) {
    let count = 2;
    if (this.checkEmail.checked)
      this.check("email", "not-valid", "valid", "", { flag: "remove" });
    else {
      this.check("email", "valid", "not-valid", "Wrong email", {
        flag: "add",
      });
      count--;
    }
    if (this.checkPassword.checked)
      this.check("password", "not-valid", "valid", "", { flag: "remove" });
    else {
      this.check(
        "password",
        "valid",
        "not-valid",
        "The password must contain at least one capital letter, at least one number, and at least one special character",
        { flag: "add" }
      );
      count--;
    }

    return count;
  }
  validateInput(event) {
    const type = event.target.getAttribute("type");
    if (type === "email") {
      if (this.checkEmail.regExp.test(event.target.value))
        this.checkEmail.checked = true;
      else this.checkEmail.checked = false;
    } else if (type === "password") {
      if (this.checkPassword.regExp.test(event.target.value))
        this.checkPassword.checked = true;
      else this.checkPassword.checked = false;
    }
  }
  createInput(labelInner, type) {
    const wrap = document.createElement("div");
    wrap.classList.add("input-wrapper");
    const label = document.createElement("label");
    label.setAttribute("for", type);
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
  async login() {
    try {
      this.resultErr.innerText = "";
      this.spinner.classList.add("active-spinner");

      const user = {
        email: this.email.value,
        password: this.password.value,
      };
      const reg = await fetch(URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      this.spinner.classList.remove("active-spinner");
      if (reg.status === 401) {
        const result = await reg.json();
        this.resultErr.innerText = result.message;
        return;
      }
      if (reg.ok) {
        const result = await reg.json();
        localStorage.setItem("id", result.id);
        this.el.dispatchEvent(
          new CustomEvent("register", {
            bubbles: true,
          })
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  async register() {
    try {
      this.spinner.classList.add("active-spinner");
      this.resultErr.innerText = "";
      const user = {
        email: this.email.value,
        password: this.password.value,
      };
      const reg = await fetch(URL + "/registr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      this.spinner.classList.remove("active-spinner");
      if (reg.status === 401) {
        const result = await reg.json();
        this.resultErr.innerText = result.message;
        return;
      }
      if (reg.ok) {
        const result = await reg.json();
        localStorage.setItem("id", result.id);
        this.el.dispatchEvent(
          new CustomEvent("register", {
            bubbles: true,
          })
        );
      }
    } catch (error) {
      console.error(error);
      this.resultErr.innerText = error.message;
    }
  }
  createButtons() {
    const wrapButtons = document.createElement("div");
    wrapButtons.className = "buttons-wrapper";
    this.buttonLogin = document.createElement("button");
    this.buttonLogin.addEventListener("click", async (e) => {
      this.buttonLogin.dispatchEvent(
        new CustomEvent("updateActiveButton", { bubbles: true })
      );

      try {
        this.validateInput(e);
        const resValidate = this.checkInput(e);
        if (resValidate === 2) await this.login();
      } catch (error) {
        console.error(error);
      }
    });

    this.buttonLogin.innerText = "Login";
    this.buttonRegistr = document.createElement("button");
    this.buttonRegistr.addEventListener("click", async (e) => {
      this.buttonRegistr.dispatchEvent(
        new CustomEvent("updateActiveButton", { bubbles: true })
      );
      try {
        this.validateInput(e);
        const resValidate = this.checkInput(e);
        if (resValidate === 2) await this.register();
      } catch (error) {
        console.error(error);
      }
    });
    this.buttonRegistr.innerText = "Registration";
    wrapButtons.append(this.buttonLogin, this.buttonRegistr);
    return wrapButtons;
  }
  render() {
    const container = document.createElement("div");
    container.className = "form__wrapper";

    this.spinner = document.createElement("div");
    this.spinner.classList.add("login-spinner");

    const spanSpinner = document.createElement("span");
    spanSpinner.classList.add("span-spinner");
    this.spinner.append(spanSpinner);
    const wrap = document.createElement("div");
    container.append(wrap);
    const title = document.createElement("h2");
    title.innerText = this.title;
    this.resultErr = document.createElement("p");
    this.resultErr.classList.add("result-err");
    wrap.append(
      title,
      this.createInput("Email", "email"),
      this.createInput("Password", "password"),
      this.resultErr,
      this.createButtons(),
      this.spinner
    );
    return container;
  }
}
