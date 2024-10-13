import { Auth } from "./auth/auth.js";
import { Main } from "./main/main.js";
import { Data } from "./pages/data-page/data-page.js";
import { Home } from "./pages/home/home.js";
import { Pay } from "./pages/pay/pay.js";
import { Plan } from "./pages/plan/plan.js";
import { Schedule } from "./pages/schedule/schedule.js";
import { Settings } from "./pages/settings/settings.js";
import { URL } from "./config/config.js";
class App {
  constructor() {
    this.auth = new Auth();
    this.main = new Main();
    this.body = document.body;
    this.work();
  }
  async updateUserInfo() {
    try {
      const pathUrl = location.pathname;
      if (pathUrl === "/auth") return;
      const res = await fetch(URL + "/email", {
        method: "GET",
        headers: {
          id: localStorage.getItem("id"),
					
        },
      });
      if (res.ok) {
        const body = await res.json();
        if (body.name) this.main.header.changeUserName(body.name);
        this.main.header.changeUserEmail(body.email);
      } else throw new Error(`Error ${res.status} ${res.statusText}`);
    } catch (error) {
      console.log(error.message);
    }
  }
  changeTitle(path) {
    const newTitle = path.slice(1);
    if (newTitle.length === 0) this.main.header.changeTitle("Home");
    else {
      const titleUpdate = newTitle[0].toUpperCase() + newTitle.slice(1);
      this.main.header.changeTitle(titleUpdate);
    }
  }
  routeToPage(e) {
    if (e.target.matches("[data-link]")) {
      const href = e.target.getAttribute("href");
      e.preventDefault();
      this.changeHref(href);
    }
  }
  changeHref(href, flag = true) {
    history.pushState(null, null, href);
    if (flag) sessionStorage.setItem("current-url", href);
    this.route();
  }
  changeContent(classPage) {
    const pageEl = new classPage();
    const children = Array.from(this.main.mainContent.children);
    const elWithAttrData = children.find((item) =>
      item.hasAttribute("data-content")
    );
    if (elWithAttrData) elWithAttrData.remove();
    this.main.mainContent.append(pageEl.el);
  }
  route() {
    const routes = [
      {
        path: "/",
        view: () => {
          this.changeContent(Home);
          this.changePage(this.main.el);
          this.changeTitle("/");
        },
      },
      {
        path: "/data",
        view: () => {
          this.changePage(this.main.el);
          this.changeContent(Data);
          this.changeTitle("/data");
        },
      },
      {
        path: "/pay",
        view: () => {
          this.changePage(this.main.el);
          this.changeTitle("/pay");
          this.changeContent(Pay);
        },
      },
      {
        path: "/schedule",
        view: () => {
          this.changePage(this.main.el);
          this.changeContent(Schedule);
          this.changeTitle("/schedule");
        },
      },
      {
        path: "/plan",
        view: () => {
          this.changePage(this.main.el);
          this.changeContent(Plan);
          this.changeTitle("/plan");
        },
      },
      {
        path: "/settings",
        view: () => {
          this.changePage(this.main.el);
          this.changeContent(Settings);
          this.changeTitle("/settings");
        },
      },
      {
        path: "/auth",
        view: () => {
          this.changePage(this.auth.el);
        },
      },
    ];
    const activeWindow = routes.map((route) => {
      return {
        route: route,
        isActive: route.path === location.pathname,
      };
    });
    let searchLink = activeWindow.find((item) => item.isActive);
    if (!searchLink) searchLink = { route: routes[0], isActive: true };
    searchLink.route.view();
  }
  async checkAuth() {
    const pathUrl = location.pathname;
    const id = localStorage.getItem("id");
    let check = true;
    if (id) {
      try {
        const res = await fetch(URL + "/checkId", {
          method: "GET",
          headers: {
            id: id,
          },
        });
        check = res.ok;
      } catch {
        check = false;
      }
    }

    if (pathUrl === "/auth" && !id) this.changeHref("/auth");
    else if (pathUrl === "/auth" && id && check) this.changeHref("/");
    else if (pathUrl === "/") {
      if (!id || !check) this.changeHref("/auth");
      else {
        let currentUrl = sessionStorage.getItem("current-url");
        if (currentUrl && currentUrl !== "/auth")
          this.changeHref(currentUrl, false);
        else this.changeHref("/");
      }
    } else if (id && check) {
      switch (pathUrl) {
        case "/data":
        case "/pay":
        case "/settings":
        case "/schedule":
        case "/plan":
          this.changeHref(pathUrl);
          break;
        default:
          this.changeHref("/");
          break;
      }
    } else this.changeHref("/auth");
  }
  changePage(elem) {
    if (this.body.firstElementChild) this.body.firstElementChild.remove();
    this.body.append(elem);
  }
  async work() {
    await this.checkAuth();
    this.body.addEventListener("register", async () => await this.checkAuth());
    this.body.addEventListener("exit", async () => {
      this.auth.password.value = "";
      this.auth.email.value = "";
      await this.checkAuth();
    });
    this.body.addEventListener("click", (e) => this.routeToPage(e));
    window.addEventListener("popstate", (e) => {
      sessionStorage.setItem("current-url", location.pathname);
      this.route();
    });
    await this.updateUserInfo();
  }
}
const app = new App();
