import Users from "../users/users.js";
import UserData from "./users-data.js";
export class Data {
  constructor() {
    this.el = this.render();
  }
  
   render() {
    this.wrap = document.createElement("div");
    this.wrap.addEventListener("checkUserData", (e) => {
      const id = e.detail._id;
      this.userData =  new UserData(true,id);
      this.wrap.lastElementChild.remove();
      this.wrap.append(this.userData.el);
    });
    this.wrap.classList.add("users-content");
    this.userData = new UserData(false);
    this.wrap.append(new Users().el, this.userData.el);
    this.wrap.setAttribute("data-content", "");
    return this.wrap;
  }
}
