export default class Users {
	constructor() {
		this.inputAlive = false
		this.regExpCheckName = /^[a-zA-Zà-žÀ-ŽА-Яа-яЁёЇїІіЄєҐґ' -]+$/
		this.el = this.render()
	}
	async updateShowStudents() {
		try {
			const id = localStorage.getItem("id")
			const response = await fetch("http://localhost:4001/student", {
				method: "GET",
				headers: {
					auth: id,
				},
			})
			const body = await response.json()
			const students = body.students
			if (!response.ok) return
			const children = Array.from(this.allStudents.children)
			if (children.length !== 0) children.forEach((item) => item.remove())
			students.forEach((item) => {
				const stud = document.createElement("div")
				stud.classList.add("one-stud")
				stud.innerText = item.name
				this.allStudents.append(stud)
			})
			this.allStudents.style.marginBottom = "10px"
		} catch (error) {
			console.log(error)
		}
	}
	async createNewStudents() {
		if (this.regExpCheckName.test(this.input.value)) {
			try {
				const id = localStorage.getItem("id")
				const res = await fetch("http://localhost:4001/addstud", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fullName: this.input.value,
						id: id,
					}),
				})
				const result = await res.json()
				if (!res.ok) console.log(result.message)
				this.input.parentElement.remove()
				this.inputAlive = false
				await this.updateShowStudents()
			} catch (error) {
				alert(error.message)
			}
		} else throw new Error("Wrong full name")
	}
	createInputAddStud() {
		const inputWrap = document.createElement("div")
		inputWrap.classList.add("input-add-stud")
		this.input = document.createElement("input")
		this.input.placeholder = "Enter student full name"
		const button = document.createElement("button")
		button.addEventListener("click", async () => {
			try {
				await this.createNewStudents()
			} catch (error) {
				alert(error.message)
			}
		})

		button.innerText = "Add"
		button.classList.add("check-stud")
		inputWrap.append(this.input, button)
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
		const button = document.createElement("button")
		button.innerText = inner
		button.addEventListener("click", eventNow.bind(this))
		button.classList.add(addClass)
		wrapButton.append(button)
		return wrapButton
	}
	async updateStude() {
		await this.updateShowStudents()
	}
	render() {
		const wrap = document.createElement("div")
		wrap.classList.add("users-block")
		this.wrapInputAddStud = document.createElement("div")
		this.allStudents = document.createElement("div")
		this.allStudents.classList.add("wrap-students")
		const wrapButtons = document.createElement("div")
		const btnAdd = this.createBtnAddStud(
			this.eventAddStud,
			"button-add-student",
			"Add student"
		)
		const btnCancel = this.createBtnAddStud(
			this.eventCanselAddStud,
			"button-cancel-add-student",
			"Cancel"
		)
		wrapButtons.append(btnAdd, btnCancel)
		wrapButtons.classList.add("wrap-buttons-stud")
		wrap.append(this.wrapInputAddStud, this.allStudents, wrapButtons)
		this.updateStude()
		return wrap
	}
}
