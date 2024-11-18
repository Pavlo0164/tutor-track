import { Auth } from "./auth/auth.js"
import { Main } from "./main/main.js"
import { Data } from "./pages/data-page/data-page.js"
import { Home } from "./pages/home/home.js"
import { Pay } from "./pages/pay/pay.js"
import { Plan } from "./pages/plan/plan.js"
import { Schedule } from "./pages/schedule/schedule.js"
import { Settings } from "./pages/settings/settings.js"
import createElement from "./functions/create-element.js"
import { checkAuth, getUserInfo } from "./api/api.js"
class App {
	constructor() {
		this.auth = new Auth("Login", "log")
		this.main = new Main()
		this.body = document.querySelector(".wrapper")
		this.work()
	}
	async updateUserInfo() {
		try {
			const pathUrl = location.pathname
			const accessToken = sessionStorage.getItem("accessToken")
			if (pathUrl !== "/login" && pathUrl !== "/signUp" && accessToken) {
				const { email, name } = await getUserInfo(accessToken)
				this.main.header.changeUserName(name)
				this.main.header.changeUserEmail(email)
			}
		} catch (error) {
			throw new Error(`Error ${error.status} ${error.statusText}`)
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
	switchFunc(pathUrl) {
		switch (pathUrl) {
			case "/login":
				this.changeHref("/login")
				break
			case "/signUp":
				this.changeHref("/signUp")
				break
			default:
				this.changeHref("/login")
		}
	}
	successfullSpinner() {
		const wrapSpinner = createElement(
			"div",
			"login-spinner",
			null,
			"Login was successfull!!!"
		)
		this.body.append(wrapSpinner)

		wrapSpinner.classList.add("active")
		setTimeout(() => {
			wrapSpinner.classList.remove("active")
			setTimeout(() => this.body.lastElementChild.remove(), 1000)
		}, 2000)
	}
	async checkAuth() {
		const pathUrl = location.pathname
		const accessToken = sessionStorage.getItem("accessToken")
		try {
			if (!accessToken) {
				this.switchFunc(pathUrl)
				return
			}
			const res = await checkAuth()
			if (res.status >= 300) this.switchFunc(pathUrl)
			else {
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
			}
		} catch (error) {
			this.changeHref("/login")
			console.log(error)
		}
	}
	changePage(elem) {
		if (this.body.firstElementChild) this.body.firstElementChild.remove()
		this.body.prepend(elem)
	}
	async work() {
		try {
			await this.checkAuth()
			this.body.addEventListener("register", async (e) => {
				await this.checkAuth()
				this.successfullSpinner()
			})

			this.body.addEventListener("exit", await this.checkAuth.bind(this))
		} catch (error) {
			console.log(error.message)
		}
		this.body.addEventListener("click", this.routeToPage.bind(this))
		window.addEventListener("popstate", this.route.bind(this))
		this.body.addEventListener(
			"updateActiveButton",
			this.main.aside.addClassToHome.bind(this)
		)
	}
}
const app = new App()
