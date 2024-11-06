import { Auth } from "./auth/auth.js"
import { Main } from "./main/main.js"
import { Data } from "./pages/data-page/data-page.js"
import { Home } from "./pages/home/home.js"
import { Pay } from "./pages/pay/pay.js"
import { Plan } from "./pages/plan/plan.js"
import { Schedule } from "./pages/schedule/schedule.js"
import { Settings } from "./pages/settings/settings.js"
import { URL } from "./config/config.js"
class App {
	constructor() {
		this.auth = new Auth("Login", "log")
		this.main = new Main()
		this.body = document.body
		this.work()
	}
	async updateUserInfo() {
		try {
			const pathUrl = location.pathname
			if (pathUrl === "/login" || pathUrl === "/signUp") return
			const res = await fetch(URL + "/email", {
				method: "GET",
				headers: {
					accessToken: sessionStorage.getItem("accessToken"),
				},
			})
			if (res.ok) {
				const body = await res.json()
				if (body.name) this.main.header.changeUserName(body.name)
				this.main.header.changeUserEmail(body.email)
			} else throw new Error(`Error ${res.status} ${res.statusText}`)
		} catch (error) {
			console.log(error.message)
		}
	}
	routeToPage(e) {
		if (e.target.matches("[data-link]")) {
			const href = e.target.getAttribute("href")
			this.changeHref(href)
		}
	}
	async changeHref(href) {
		history.pushState(null, null, href)
		this.route()
		await this.updateUserInfo()
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
				path: "/home",
				view: () => {
					this.changeContent(Home)
					this.changePage(this.main.el)
					this.main.header.changeTitle("Home")
					this.main.aside.addClassToHome()
				},
			},
			{
				path: "/data",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Data)
					this.main.header.changeTitle("Data")
				},
			},
			{
				path: "/pay",
				view: () => {
					this.changePage(this.main.el)
					this.main.header.changeTitle("Pay")
					this.changeContent(Pay)
				},
			},
			{
				path: "/schedule",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Schedule)
					this.main.header.changeTitle("Schedule")
				},
			},
			{
				path: "/plan",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Plan)
					this.main.header.changeTitle("Plan")
				},
			},
			{
				path: "/settings",
				view: () => {
					this.changePage(this.main.el)
					this.changeContent(Settings)
					this.main.header.changeTitle("Settings")
				},
			},
			{
				path: "/login",
				view: () => {
					this.changePage(this.auth.el)
				},
			},
			{
				path: "/signUp",
				view: () => {
					this.changePage(new Auth("Register", "reg").el)
				},
			},
		]
		let searchLink = routes.find((el) => el.path === location.pathname)
		if (!searchLink) {
			searchLink = routes[0]
		}
		searchLink.view()
	}

	async checkAuth() {
		const pathUrl = location.pathname
		const accessToken = sessionStorage.getItem("accessToken")

		if (!accessToken) {
			switch (pathUrl) {
				case "/login":
				case "/signUp":
					this.changeHref(pathUrl)
					break
				default:
					this.changeHref("/login")
					break
			}
			return
		}
		try {
			const res = await fetch(URL + "/checkToken", {
				method: "GET",
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			})
			if (!res.ok) this.changeHref("/login")
			else
				switch (pathUrl) {
					case "/home":
					case "/data":
					case "/pay":
					case "/settings":
					case "/schedule":
					case "/plan":
						this.changeHref(pathUrl)
						break
					default:
						this.changeHref("/home")
						break
				}
		} catch (error) {
			console.log(error.message)
		}
	}
	changePage(elem) {
		if (this.body.firstElementChild) this.body.firstElementChild.remove()
		this.body.append(elem)
	}
	async work() {
		try {
			await this.checkAuth()
			this.body.addEventListener("register", async () => {
				await this.checkAuth()
			})
			this.body.addEventListener("exit", async () => {
				this.auth.password.value = ""
				this.auth.email.value = ""
				await this.checkAuth()
			})
		} catch (error) {
			console.log(error.message)
		}
		this.body.addEventListener("click", (e) => this.routeToPage(e))
		window.addEventListener("popstate", (e) => this.route())
		this.body.addEventListener("updateActiveButton", (e) => {
			this.main.aside.addClassToHome()
		})
	}
}
const app = new App()
