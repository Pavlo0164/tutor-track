import { URL } from "../../config/config.js";
export default class UserData {
  constructor(type, id = null) {
    this.id = id;
    this.el = this.render();
    this.init(this.id);
  }
  async init(id) {
    if (id) {
      try {
        const { details, userId } = await this.getInfoAboutStudent();
        if (details.student) {
          this.wrap.innerText = "";
          this.wrap.append(this.createInfoPage(details.student, userId));
        } else this.wrap.innerText = "Student information is not available";
      } catch (error) {
        this.wrap.innerText = "Error loading student information";
      }
    }
  }
  async getInfoAboutStudent() {
    const userId = this.id;
    const id = localStorage.getItem("id");
    try {
      const res = await fetch(URL + "/userInfo", {
        method: "GET",
        headers: {
          userid: userId,
          id: id,
        },
      });

      if (res.ok) {
        const details = await res.json();
        return { details, userId };
      }
    } catch (error) {
      console.log(error.message);
      throw new Error(`Error what happend`);
    }
  }
  createInput(type, labelValue, value = null, name) {
    const wrap = document.createElement("div");
    wrap.classList.add("input-student-wrap");
    const label = document.createElement("label");
    label.innerText = labelValue;
    const input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("name", name);
    input.value = value ? value : "";
    if (value) input.value = value;
    wrap.append(label, input);
    return wrap;
  }
  createButton(tag, classEl = null, inner = null, attrEl = null) {
    const button = document.createElement(tag);
    if (classEl) button.classList.add(classEl);
    if (inner) button.innerText = inner;
    if (attrEl) for (const key in attrEl) button.setAttribute(key, attrEl[key]);

    return button;
  }

  createInfoPage(details, userId) {
    const wrap = document.createElement("form");
    this.successfullUpdate = document.createElement("div");
    this.successfullUpdate.classList.add("successfull-update");
    this.successfullUpdate.innerText = "The information was updated!!!";

    this.popUp = this.createButton("div", "popup-delete-stud");
    const wrapperPopup = document.createElement("div");
    const wrapButtonPopUp = document.createElement("div");
    const btnDeleteStud = this.createButton("button", "yes-delete", "Delete");
    const btnCancelDeleteStud = this.createButton(
      "button",
      "no-delete",
      "Cancel"
    );
    wrapButtonPopUp.append(btnDeleteStud, btnCancelDeleteStud);
    wrapperPopup.append(
      this.createButton("div", null, "Do you want to delete the student?"),
      wrapButtonPopUp
    );
    btnCancelDeleteStud.addEventListener("click", (e) => {
      this.popUp.classList.remove("active-popup");
    });
    btnDeleteStud.addEventListener("click", async (e) => {
      this.popUp.classList.remove("active-popup");
      const deleteStud = await fetch(URL + "/deleteStudent", {
        method: "DELETE",
        headers: {
          userid: userId,
          id: localStorage.getItem("id"),
        },
      });
      if (deleteStud.status === 200) {
        wrap.dispatchEvent(new CustomEvent("deleteStudent", { bubbles: true }));
      }
    });
    this.popUp.append(wrapperPopup);
    wrap.addEventListener("reset", async (e) => {
      e.preventDefault();
      this.popUp.classList.add("active-popup");
    });
    wrap.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    wrap.addEventListener("click", async (e) => {
      if (e.target.classList.contains("button-save-info")) {
        e.preventDefault();
        const formData = new FormData(wrap);
        const updatedData = {};
        formData.forEach((value, key) => {
          updatedData[key] = value;
        });
        const id = localStorage.getItem("id");
        const sendData = await fetch(URL + "/updateInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            userid: userId,
            id: id,
          },
          body: JSON.stringify(updatedData),
        });
        if (sendData.status === 204) {
          this.successfullUpdate.classList.add("show-update");
          setTimeout(() => {
            this.successfullUpdate.classList.remove("show-update");
          }, 2000);
        }
      }
    });
    wrap.classList.add("infoPage");
    const wrapForButtons = document.createElement("div");
    wrapForButtons.classList.add("buttons-wrapper");
    wrapForButtons.append(
      this.createButton("button", "button-save-info", "Save", {
        type: "submit",
      }),
      this.createButton("button", "delete-ctudent", "Delete", {
        type: "reset",
      })
    );
    wrap.append(
      this.createInput("text", "Name", details.name, "name"),
      this.createInput("text", "Surname", details.surname, "surname"),
      this.createInput("text", "City", details.city, "city"),
      this.createInput("text", "Birthday", details.birthday, "birthday"),
      this.createInput("text", "Sex", details.sex, "sex"),
      this.createInput("text", "Phone", details.phone, "phone"),
      this.createInput(
        "text",
        "Parents phone",
        details.parentsPhone,
        "parentsPhone"
      ),
      this.createInput("email", "Email", details.email, "email"),
      this.createInput(
        "text",
        "Lessons link",
        details.linkOnLesson,
        "linkOnLesso"
      ),
      this.createInput("text", "Subject", details.subject, "subject"),
      this.createInput(
        "text",
        "Start of the study",
        details.startOfTheStudy,
        "startOfTheStud"
      ),
      this.createInput(
        "text",
        "Session duration",
        details.sessionDuration,
        "sessionDuration"
      ),
      this.createInput(
        "number",
        "Cost of lesson",
        details.costOfLesson,
        "costOfLesson"
      ),
      wrapForButtons,
      this.successfullUpdate,

      this.popUp
    );

    return wrap;
  }
  render() {
    this.wrap = document.createElement("div");
    this.wrap.classList.add("users-info");
    if (!this.id) this.wrap.innerText = "You don`t have any student";
    return this.wrap;
  }
}
