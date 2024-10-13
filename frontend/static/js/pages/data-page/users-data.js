import { URL } from "../../config/config.js";
export default class UserData {
  constructor(type, id = null) {
    this.id = id;
    this.type = type;
    this.el = this.render();
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
      if (res.ok) return await res.json();
    } catch (error) {
      throw new Error(`Error what happend`);
    }
  }
  createInput(type, name, value = null) {
    const wrap = document.createElement("div");
    const label = document.createElement("label");
    label.innerText = name;
    const input = document.createElement("input");
    input.setAttribute("type", type);
    if (value) input.value = value;
    wrap.append(label, input);
    return wrap;
  }
  createInfoPage(details) {
    const wrap = document.createElement("div");
    wrap.classList.add("infoPage");
    wrap.append(
      this.createInput("text", "Name"),
      this.createInput("text", "Surname"),
      this.createInput("text", "City"),
      this.createInput("text", "Birthday"),
      this.createInput("text", "Sex"),
      this.createInput("text", "Phone"),
      this.createInput("text", "Parents phone")
    );
    return wrap;
  }
  render() {
    const wrap = document.createElement("div");
    wrap.classList.add("users-info");
    if (!this.type) {
      wrap.innerText = "Choose the student to see more information";
      return wrap;
    }
    // else {
    //   try {
    //     const details = await this.getInfoAboutStudent();
    //     console.log(details);

    //     if (details) wrap.append(this.createInfoPage(details));
    //     else wrap.innerText = "Student information is not available";
    //     return wrap;
    //   } catch (error) {
    //     wrap.innerText = "Error loading student information";
    //     console.log(error.message);
    //   }
    // }
  }
}
