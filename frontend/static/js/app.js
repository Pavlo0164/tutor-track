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
			const res = await fetch("https://jsonplaceholder.typicode.com/users")
			if (res.ok) {
				const users = await res.json()
				this.main.header.changeUserName(users[0].username)
				this.main.header.changeUserEmail(users[0].email)
			}
		} catch (error) {
			alert(error.message)
		}
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
			e.preventDefault()
			this.changeHref(e.target.getAttribute("href"))
		}
	}
	changeHref(href) {
		history.pushState(null, null, href)
		localStorage.setItem("current-url", href)
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
		const id = localStorage.getItem("id")
		
		if (!id) 
			this.changeHref("/auth")
		
		
		else {
			if (localStorage.getItem("current-url")) 
			this.changeHref(localStorage.getItem("current-url"))
			
			else this.changeHref("/")
		}
	}
	changePage(elem) {
		if (this.body.firstElementChild) this.body.firstElementChild.remove()
		this.body.append(elem)
	}
	async work() {
		this.checkAuth()

		if (localStorage.getItem("current-url")) {
			this.changeHref(localStorage.getItem("current-url"))
			console.log(true)
		}

		this.route()
		this.body.addEventListener("register", () => this.checkAuth())
		this.body.addEventListener("exit", () => {
			this.auth.password.value = ""
			this.auth.email.value = ""
			this.checkAuth()
		})
		this.body.addEventListener("click", (e) => this.routeToPage(e))
		window.addEventListener("popstate", () => this.route())
		await this.updateUserInfo()
	}
}

const app = new App()
