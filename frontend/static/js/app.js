import { Auth } from "./auth/auth.js"
import { Main } from "./main/main.js"
import { Data } from "./pages/data-page/data-page.js"
import { Home } from "./pages/home/home.js"
import { Pay } from "./pages/pay/pay.js"
import { Plan } from "./pages/plan/plan.js"
import { Schedule } from "./pages/schedule/schedule.js"
import { Settings } from "./pages/settings/settings.js"
class App {
	constructor() {
		this.auth = new Auth()
		this.main = new Main()

		this.body = document.body
		this.work()
	}
	async updateUserInfo() {
		try {
			const res = await fetch("http://localhost:4001/email", {
				method: "GET",
				headers: {
					id: localStorage.getItem("id"),
				},
			})
			if (res.ok) {
				const body = await res.json()
				if (body.name) this.main.header.changeUserName(body.name)
				this.main.header.changeUserEmail(body.email)
			}
		} catch (error) {}
	}
	changeTitle(path) {
		const newTitle = path.slice(1)
		if (newTitle.length === 0) this.main.header.changeTitle("Home")
		else {
			const titleUpdate = newTitle[0].toUpperCase() + newTitle.slice(1)
			this.main.header.changeTitle(titleUpdate)
		}
	}
	routeToPage(e) {
		if (e.target.matches("[data-link]")) {
			const href = e.target.getAttribute("href")
			e.preventDefault()
			this.changeHref(href)
		}
	}
	changeHref(href, flag = true) {
		history.pushState(null, null, href)
		if (flag) sessionStorage.setItem("current-url", href)
		this.route()
	}
	changeContent(classPage) {
		const pageEl = new classPage()
		const children = Array.from(this.main.mainContent.children)
		const elWithAttrData = children.find((item) =>
			item.hasAttribute("data-content")
		)
		if (elWithAttrData) elWithAttrData.remove()
		this.main.mainContent.append(pageEl.el)
	}
	route() {
		const routes = [
			{
				path: "/",
				view: () => {
					this.changeContent(Home)
					this.changePage(this.main.el)
					this.changeTitle("/")
				},
			},
			{
				path: "/data",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Data)
					this.changeTitle("/data")
				},
			},
			{
				path: "/pay",
				view: () => {
					this.changePage(this.main.el)
					this.changeTitle("/pay")
					this.changeContent(Pay)
				},
			},
			{
				path: "/schedule",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Schedule)
					this.changeTitle("/schedule")
				},
			},
			{
				path: "/plan",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Plan)
					this.changeTitle("/plan")
				},
			},
			{
				path: "/settings",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Settings)
					this.changeTitle("/settings")
				},
			},
			{
				path: "/auth",
				view: () => {
					this.changePage(this.auth.el)
				},
			},
		]
		const activeWindow = routes.map((route) => {
			return {
				route: route,
				isActive: route.path === location.pathname,
			}
		})
		let searchLink = activeWindow.find((item) => item.isActive)
		if (!searchLink) searchLink = { route: routes[0], isActive: true }
		searchLink.route.view()
	}
	checkAuth() {
		const pathUrl = location.pathname
		const id = localStorage.getItem("id")
		if (pathUrl === "/auth" && !id) this.changeHref("/auth")
		else if (pathUrl === "/auth" && id) this.changeHref("/")
		else if (pathUrl === "/") {
			if (!id) this.changeHref("/auth")
			else {
				let currentUrl = sessionStorage.getItem("current-url")
				if (currentUrl && currentUrl !== "/auth")
					this.changeHref(currentUrl, false)
				else this.changeHref("/")
			}
		} else if (id) {
			switch (pathUrl) {
				case "/data":
					this.changeHref("/data")
					break
				case "/pay":
					this.changeHref("/pay")
					break
				case "/settings":
					this.changeHref("/settings")
					break
				case "/schedule":
					this.changeHref("/schedule")
					break
				case "/plan":
					this.changeHref("/plan")
					break
				default:
					this.changeHref("/")
					break
			}
		} else this.changeHref("/auth")
	}
	changePage(elem) {
		if (this.body.firstElementChild) this.body.firstElementChild.remove()
		this.body.append(elem)
	}
	async work() {
		this.checkAuth()
		this.body.addEventListener("register", () => this.checkAuth())
		this.body.addEventListener("exit", () => {
			this.auth.password.value = ""
			this.auth.email.value = ""
			this.checkAuth()
		})
		this.body.addEventListener("click", (e) => this.routeToPage(e))
		window.addEventListener("popstate", (e) => {
			sessionStorage.setItem("current-url", location.pathname)
			this.route()
		})
		await this.updateUserInfo()
	}
}
const app = new App()
