import { URL } from "../../config/config.js";
export default class UserData {
  constructor(type, id = null) {
    this.id = id;
    this.type = type;
    this.el = this.render();
    this.init(id);
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

  createInfoPage(details, userId) {
    const wrap = document.createElement("form");
    wrap.addEventListener("submit", async (e) => {
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
    });

    wrap.classList.add("infoPage");
    const buttonSave = document.createElement("button");
    buttonSave.classList.add("button-save-info");
    buttonSave.innerText = "Save";
    buttonSave.setAttribute("type", "submit");
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
      buttonSave
    );
    return wrap;
  }
  render() {
    this.wrap = document.createElement("div");
    this.wrap.classList.add("users-info");
    if (!this.type)
      this.wrap.innerText = "Choose the student to see more information";
    return this.wrap;
  }
}
