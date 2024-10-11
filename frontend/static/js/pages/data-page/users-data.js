export default class UserData {
  constructor() {
    this.el = this.render();
  }
  render() {
    const wrap = document.createElement("div");
    const input = document.createElement("input");
    wrap.append(input);
    return wrap;
  }
}
