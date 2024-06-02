export default class Users {
	constructor() {
		this.inputAlive = false
		this.regExpCheckName = /^[a-zA-Zà-žÀ-ŽА-Яа-яЁёЇїІіЄєҐґ' -]+$/
		this.el = this.render()
	}
	async updateShowStudents() {
		try {
			const id = localStorage.getItem("id")
			const response = await fetch("http://localhost:4000/students", {
				method: "GET",
				headers: {
					auth: id,
				},
			})
			const students = await response.json()
			if (response.ok) {
				const arrStud = students.students
				const children = Array.from(this.allStudents.children)
				if (children.length !== 0) children.forEach((item) => item.remove())
				arrStud.forEach((item) => {
					const stud = document.createElement("div")
					stud.innerText = item.name
					this.allStudents.append(stud)
				})
			} else {
				console.log(students)
			}
		} catch (error) {
			console.log(error.message)
		}
	}
	async createNewStudents() {
		if (this.regExpCheckName.test(this.input.value)) {
			try {
				const id = localStorage.getItem("id")
				const res = await fetch("http://localhost:4000/addstud", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fullName: this.input.value,
						id: id,
					}),
				})
				const result = await res.json()
				if (res.ok) {
					this.input.parentElement.remove()
					this.inputAlive = false
					await this.updateShowStudents()
				} else {
					alert(result.message)
				}
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
	createBtnAddStud() {
		const wrapButton = document.createElement("div")
		const button = document.createElement("button")
		button.innerText = "Add student"
		button.addEventListener("click", (e) => {
			if (!this.inputAlive) {
				this.inputAlive = true
				const input = this.createInputAddStud()
				this.wrapInputAddStud.append(input)
				input.style.marginBottom = "5px"
			}
		})
		button.classList.add("button-add-student")
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
		wrap.append(
			this.wrapInputAddStud,
			this.allStudents,
			this.createBtnAddStud()
		)
		this.updateStude()
		return wrap
	}
}
