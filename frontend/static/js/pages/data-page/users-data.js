export default class UserData {
  constructor(type, id = null) {
    this.id = id;
    this.type = type;
    this.el = this.render();
  }
  async getInfoAboutStudent() {
    try {
      const res = await fetch(URL + "/userInfo", {
        method: "GET",
        headers: {
          id: localStorage.getItem("id"),
          userId: this.id,
        },
      });
      if (res.ok) {
        const info = res.body.student;
        return info;
      }
    } catch {}
  }
  createInput(type, name, value = null) {
    const wrap = document.createElement("div");
    const label = document.createElement("label");
    label.innerText = name;
    const input = document.createElement("input");
    input.setAttribute("type", type);
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
    if (!this.type)
      wrap.innerText = "Choose the student to see more information";
    else {
      const details = this.getInfoAboutStudent();
      console.log(details);

      wrap.append(this.createInfoPage(details));
    }
    wrap.classList.add("users-info");
    return wrap;
  }
}
