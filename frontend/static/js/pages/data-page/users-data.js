import { URL } from "../../config/config.js"
import createElement from "../../functions/create-element.js"
export default class UserData {
	constructor(type, id = null) {
		this.id = id
		this.el = this.render()
		this.init(this.id)
	}
	async init(id) {
		if (id) {
			try {
				const { details, userId } = await this.getInfoAboutStudent()
				if (details.student) {
					this.wrap.innerText = ""
					this.wrap.append(this.createInfoPage(details.student, userId))
				} else this.wrap.innerText = "Student information is not available"
			} catch (error) {
				this.wrap.innerText = "Error loading student information"
			}
		}
	}
	async getInfoAboutStudent() {
		const userId = this.id
		const id = localStorage.getItem("id")
		try {
			const res = await fetch(URL + "/student/infoOne", {
				method: "GET",
				headers: {
					userid: userId,
					id: id,
				},
			})

			if (res.ok) {
				const details = await res.json()
				return { details, userId }
			}
		} catch (error) {
			console.log(error.message)
			throw new Error(`Error what happend`)
		}
	}
	createInput(type, labelValue, value = null, name) {
		const wrap = createElement("div", "input-student-wrap")
		createElement("label", null, null, labelValue, wrap)
		const input = createElement(
			"input",
			null,
			{ type: type, name: name },
			null,
			wrap
		)
		if (value) input.value = value
		return wrap
	}
	createInfoPage(details, userId) {
		const wrap = createElement("form", "infoPage")
		this.successfullUpdate = createElement(
			"div",
			"successfull-update",
			null,
			"The information was updated!!!"
		)

		this.popUp = createElement("div", "popup-delete-stud")
		const wrapperPopup = document.createElement("div")
		const wrapButtonPopUp = document.createElement("div")
		const btnDeleteStud = createElement(
			"button",
			"yes-delete",
			null,
			"Delete",
			wrapButtonPopUp
		)
		const btnCancelDeleteStud = createElement(
			"button",
			"no-delete",
			null,
			"Cancel",
			wrapButtonPopUp
		)

		wrapperPopup.append(
			createElement("div", null, null, "Do you want to delete the student?"),
			wrapButtonPopUp
		)
		btnCancelDeleteStud.addEventListener("click", (e) => {
			this.popUp.classList.remove("active-popup")
		})
		btnDeleteStud.addEventListener("click", async (e) => {
			this.popUp.classList.remove("active-popup")
			const deleteStud = await fetch(URL + "/student/delete", {
				method: "DELETE",
				headers: {
					userid: userId,
					id: localStorage.getItem("id"),
				},
			})
			if (deleteStud.status === 200) {
				wrap.dispatchEvent(new CustomEvent("deleteStudent", { bubbles: true }))
			}
		})
		this.popUp.append(wrapperPopup)
		wrap.addEventListener("reset", async (e) => {
			e.preventDefault()
			this.popUp.classList.add("active-popup")
		})
		wrap.addEventListener("submit", (e) => {
			e.preventDefault()
		})
		wrap.addEventListener("click", async (e) => {
			if (e.target.classList.contains("button-save-info")) {
				e.preventDefault()
				const formData = new FormData(wrap)
				const updatedData = {}
				formData.forEach((value, key) => {
					updatedData[key] = value
				})
				const id = localStorage.getItem("id")
				const sendData = await fetch(URL + "/update", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						userid: userId,
						id: id,
					},
					body: JSON.stringify(updatedData),
				})
				if (sendData.status === 204) {
					this.successfullUpdate.classList.add("show-update")
					setTimeout(() => {
						this.successfullUpdate.classList.remove("show-update")
					}, 2000)
				}
			}
		})

		const wrapForButtons = createElement("div", "buttons-wrapper")
		createElement(
			"button",
			"button-save-info",
			{
				type: "submit",
			},
			"Save",
			wrapForButtons
		),
			createElement(
				"button",
				"delete-ctudent",
				{
					type: "reset",
				},
				"Delete",
				wrapForButtons
			)

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
			wrapForButtons,
			this.successfullUpdate,
			this.popUp
		)
		return wrap
	}
	render() {
		let inner = ""
		if (!this.id) inner = "You don`t have any student"
		this.wrap = createElement(
			"div",
			["users-content__info", "users-info"],
			null,
			inner
		)
		return this.wrap
	}
}
