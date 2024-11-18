import createElement from "../../functions/create-element.js"
import {
	getOneStudent,
	deleteStudent,
	updateStudentInfo,
} from "../../api/api.js"
export default class UserData {
	constructor() {
		this.el = this.render()
		this.init(this.id)
	}
	async init(id) {
		if (!id) return
		try {
			const { data, userId } = await getOneStudent(id)
			if (data) {
				this.wrap.innerText = ""
				this.wrap.append(this.createInfoPage(data.student, userId))
			} else this.wrap.innerText = "Student information is not available"
		} catch (error) {
			this.wrap.innerText = "Error loading student information"
		}
	}

	createInput(type, labelValue, value = null, name) {
		const wrap = createElement("div", "input-student-wrap")
		createElement("label", null, { for: name }, labelValue, wrap)
		const input = createElement(
			"input",
			null,
			{ type: type, name: name, id: name },
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
			const deleteStud = await deleteStudent(userId)
			if (deleteStud < 300)
				wrap.dispatchEvent(new CustomEvent("deleteStudent", { bubbles: true }))
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
				const sendData = await updateStudentInfo(userId, updatedData)
				if (sendData < 300) {
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
		this.id = new URLSearchParams(window.location.search).get("id")
		this.wrap = createElement(
			"div",
			["users-content__info", "users-info"],
			null,
			this.id ? "" : "You don`t have any student"
		)
		return this.wrap
	}
}
