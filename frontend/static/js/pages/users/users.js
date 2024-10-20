import { URL } from "../../config/config.js";
export default class Users {
  constructor() {
    this.inputAlive = false;
    this.regExpCheckName = /^[a-zA-Zà-žÀ-ŽА-Яа-яЁёЇїІіЄєҐґ' -]+$/;
    this.el = this.render();
  }
  activeStudent(e) {
    const allStud = document.querySelectorAll(".one-stud");
    allStud.forEach((el) => {
      el.classList.remove("active-stude");
    });
    e.target.classList.add("active-stude");
    const eventMy = new CustomEvent("checkUserData", {
      detail: { _id: e.target.getAttribute("data-id") },
      bubbles: true,
    });
    e.target.dispatchEvent(eventMy);
  }
  async updateShowStudents() {
    try {
      const id = localStorage.getItem("id");
      const response = await fetch(URL + "/student", {
        method: "GET",
        headers: {
          auth: id,
        },
      });
      const body = await response.json();
      const students = body.students;
      if (!response.ok)
        throw new Error(`Error : ${response.status} ${response.statusText}`);
      const children = Array.from(this.allStudents.children);

      if (children.length !== 0) children.forEach((item) => item.remove());
      if (students)
        students.forEach((item) => {
          const stud = document.createElement("div");
          stud.classList.add("one-stud");
          stud.setAttribute("data-id", item._id);
          stud.innerText = item.name;
          this.allStudents.append(stud);
          stud.addEventListener("click", this.activeStudent.bind(this));
        });
      const firstStudent = this.allStudents.firstElementChild;
      if (firstStudent) {
        firstStudent.classList.add("active-stude");
        const eventFirtsStudent = new CustomEvent("firstStudent", {
          detail: {
            id: firstStudent.getAttribute("data-id"),
          },
          bubbles: true,
        });
        this.allStudents.dispatchEvent(eventFirtsStudent);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async createNewStudents() {
    if (this.regExpCheckName.test(this.input.value)) {
      try {
        const id = localStorage.getItem("id");
        await fetch(URL + "/addstud", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: this.input.value,
            id: id,
          }),
        });
        this.input.parentElement.remove();
        this.inputAlive = false;
        await this.updateShowStudents();
      } catch (error) {
        console.log(error.message);
      }
    } else throw new Error("Wrong full name");
  }
  createInputAddStud() {
    const inputWrap = document.createElement("div");
    inputWrap.classList.add("input-add-stud");
    this.input = document.createElement("input");
    this.input.placeholder = "Enter student full name";
    const button = document.createElement("button");
    button.addEventListener("click", async () => {
      try {
        await this.createNewStudents();
      } catch (error) {
        alert(error.message);
      }
    });

    button.innerText = "Add";
    button.classList.add("check-stud");
    inputWrap.append(this.input, button);
    return inputWrap;
  }
  eventAddStud() {
    if (!this.inputAlive) {
      this.inputAlive = true;
      const input = this.createInputAddStud();
      this.wrapInputAddStud.append(input);
      input.style.marginBottom = "5px";
    }
  }
  eventCanselAddStud() {
    if (this.inputAlive) this.input.parentElement.remove();
    this.inputAlive = false;
  }
  createBtnAddStud(eventNow, addClass, inner) {
    const wrapButton = document.createElement("div");
    const button = document.createElement("button");
    button.innerText = inner;
    button.addEventListener("click", eventNow.bind(this));
    button.classList.add(addClass);
    wrapButton.append(button);
    return wrapButton;
  }
  async updateStude() {
    await this.updateShowStudents();
  }
  render() {
    const wrap = document.createElement("div");
    wrap.classList.add("users-block");
    this.wrapInputAddStud = document.createElement("div");
    this.allStudents = document.createElement("div");
    this.allStudents.classList.add("wrap-students");
    const wrapButtons = document.createElement("div");
    const btnAdd = this.createBtnAddStud(
      this.eventAddStud,
      "button-add-student",
      "Add student"
    );
    const btnCancel = this.createBtnAddStud(
      this.eventCanselAddStud,
      "button-cancel-add-student",
      "Cancel"
    );
    wrapButtons.append(btnAdd, btnCancel);
    wrapButtons.classList.add("wrap-buttons-stud");
    wrap.append(this.wrapInputAddStud, this.allStudents, wrapButtons);
    this.updateStude();
    return wrap;
  }
}
