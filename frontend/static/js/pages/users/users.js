import createElement from "../../functions/create-element.js"
import { createStudent, getAllStudents } from "../../api/api.js"
export default class Users {
	constructor() {
		this.inputAlive = false
		this.regExpCheckName = /^[a-zA-Zà-žÀ-ŽА-Яа-яЁёЇїІіЄєҐґ' -]+$/
		this.el = this.render()
	}
	activeStudent(e) {
		const allStud = document.querySelectorAll(".one-stud")
		allStud.forEach((el) => {
			el.classList.remove("active-stude")
		})
		e.target.classList.add("active-stude")
		const id = e.target.getAttribute("data-id")
		window.history.pushState(
			{},
			"",
			`${window.location.origin}${window.location.pathname}?id=${id}`
		)
		e.target.dispatchEvent(
			new CustomEvent("checkUserData", {
				detail: { _id: id },
				bubbles: true,
			})
		)
	}
	async updateShowStudents() {
		try {
			const students = await getAllStudents()
			const children = Array.from(this.allStudents.children)
			if (children.length !== 0) children.forEach((item) => item.remove())
			if (students?.length > 0)
				students.forEach((item) => {
					const stud = createElement(
						"div",
						["wrap-students__student", "one-stud"],
						{ "data-id": item._id },
						item.name,
						this.allStudents
					)
					stud.addEventListener("click", this.activeStudent.bind(this))
				})
			const firstStudent = this.allStudents.firstElementChild
			if (firstStudent) {
				firstStudent.classList.add("active-stude")
				const id = firstStudent.getAttribute("data-id")
				const eventFirtsStudent = new CustomEvent("firstStudent", {
					detail: {
						id: id,
					},
					bubbles: true,
				})
				window.history.pushState(
					{},
					"",
					`${window.location.origin}${window.location.pathname}?id=${id}`
				)
				this.allStudents.dispatchEvent(eventFirtsStudent)
			} else
				window.history.pushState(
					{},
					"",
					`${window.location.origin}${window.location.pathname}`
				)
		} catch (error) {
			console.log(error)
		}
	}
	async createNewStudents() {
		try {
			if (this.regExpCheckName.test(this.input.value)) {
				const newStud = await createStudent(this.input.value)
				if (newStud) await this.updateShowStudents()
				this.input.parentElement.remove()
				this.inputAlive = false
			} else throw new Error("Wrong full name")
		} catch (error) {
			console.log(error.message)
		}
	}
	createInputAddStud() {
		const inputWrap = createElement("div", "input-add-stud")
		this.input = createElement(
			"input",
			null,
			{ placeholder: "Enter student full name" },
			null,
			inputWrap
		)
		const button = createElement(
			"button",
			["add-stud-button", "check-stud"],
			null,
			"Add",
			inputWrap
		)
		button.addEventListener("click", async () => {
			try {
				await this.createNewStudents()
				this.btnCancel.firstElementChild.classList.remove("show-btn")
			} catch (error) {
				console.log(error)
			}
		})
		return inputWrap
	}
	eventAddStud() {
		if (!this.inputAlive) {
			this.inputAlive = true
			const input = this.createInputAddStud()
			this.wrapInputAddStud.append(input)
			input.style.marginBottom = "5px"
		}
	}
	eventCanselAddStud() {
		if (this.inputAlive) this.input.parentElement.remove()
		this.inputAlive = false
	}
	createBtnAddStud(eventNow, addClass, inner) {
		const wrapButton = document.createElement("div")
		const button = createElement("button", addClass, null, inner, wrapButton)
		button.addEventListener("click", eventNow.bind(this))
		return wrapButton
	}
	async updateStude() {
		await this.updateShowStudents()
	}
	render() {
		const wrap = createElement("div", [
			"users-content__users-list",
			"users-block",
		])
		this.wrapInputAddStud = createElement("div", "users-block__input-wrapper")
		this.allStudents = createElement("div", [
			"users-block__students-wrap",
			"wrap-students",
		])
		const wrapButtons = createElement("div", [
			"users-block__buttons",
			"wrap-buttons-stud",
		])
		const btnAdd = this.createBtnAddStud(
			this.eventAddStud,
			"button-add-student",
			"Add student"
		)
		btnAdd.addEventListener("click", (e) => {
			this.btnCancel.firstElementChild.classList.add("show-btn")
		})
		this.btnCancel = this.createBtnAddStud(
			this.eventCanselAddStud,
			"button-cancel-add-student",
			"Cancel"
		)
		this.btnCancel.addEventListener("click", (e) => {
			this.btnCancel.firstElementChild.classList.remove("show-btn")
		})
		wrapButtons.append(btnAdd, this.btnCancel)
		wrap.append(this.wrapInputAddStud, this.allStudents, wrapButtons)
		this.updateStude()
		return wrap
	}
}
