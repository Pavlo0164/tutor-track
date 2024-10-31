require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")

const app = express()
const mongoose = require("mongoose")
const Teacher = require("./dbTeacher.js")
const Student = require("./dbStudent.js")
const cookieParser = require("cookie-parser")
const URI = process.env.DATABASE_URL
const PORT = process.env.PORT || 4001

const registrationService = require("./microservices/registration.js")
mongoose
	.connect(URI)
	.then(() => console.log("Connected to MongoDB Atlas with Mongoose"))
	.catch((err) => console.error("Failed to connect to MongoDB Atlas", err))
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.post("/registr", async (req, res) => {
	try {
		const { username, email, password, confirmPassword } = req.body
		const { status, message, teacher } =
			await registrationService.registartionTeacher(
				username,
				email,
				password,
				confirmPassword
			)
		res.status(status).json({
			id: teacher ? teacher.id : "",
			message: message,
		})
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
})
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body
		const searchUser = await Teacher.findOne({ email: email })
		if (!searchUser)
			return res.status(401).json({ message: "Username not exists" })
		const checkPassword = await bcrypt.compare(password, searchUser.password)
		if (!checkPassword)
			return res.status(401).json({ message: "Wrong password" })
		res.status(201).json({
			id: searchUser.id,
			message: "User logined successfully",
		})
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
})
app.get("/checkId", async (req, res) => {
	try {
		const id = req.headers.id
		const aliveId = await Teacher.findOne({ id: id })
		if (id === aliveId.id) {
			res.status(201).json({ status: true })
		} else {
			res.status(404).json({ message: "User not exist" })
		}
	} catch (error) {}
})
app.delete("/deleteStudent", async (req, res) => {
	try {
		const { userid, id } = req.headers

		const teacher = await Teacher.findOne({ id: id })

		if (!teacher) res.status(404).json({ message: "Teacher doesn`t exist" })
		const student = teacher.students.find((el) => el._id.equals(userid))

		if (!student) res.status(404).json({ message: "User doesn`t exists" })
		teacher.students = teacher.students.filter((el) => !el._id.equals(userid))
		console.log(teacher.students)

		await teacher.save()
		res.status(200).end()
	} catch (error) {
		console.log(error)
	}
})
app.get("/userInfo", async (req, res) => {
	try {
		const { userid, id } = req.headers
		const check = await Teacher.findOne({ id: id })
		if (!check) res.status(404).json({ message: "Teacher does not exist" })
		else {
			const student = check.students.find((el) => el._id.equals(userid))
			if (!student) res.status(404).json({ message: "Student does not exist" })
			else res.status(201).json({ student: student })
		}
	} catch (error) {
		console.log(error.message)
	}
})
app.post("/updateInfo", async (req, res) => {
	try {
		const userID = req.headers.userid
		const id = req.headers.id
		const teacher = await Teacher.findOne({ id: id })
		if (!teacher) res.status(404).json({ message: "Teacher does not exist" })
		const student = teacher.students.find((el) => el._id.equals(userID))
		if (!student) res.status(404).json({ message: "Student does not exist" })
		Object.assign(student, req.body)
		await teacher.save()
		res.status(204).end()
	} catch (error) {
		console.log(error.message)
	}
})

app.post("/addstud", async (req, res) => {
	try {
		const { id, fullName } = req.body
		if (!fullName || !id)
			return res.status(401).json({ message: "Wrong fullname or id" })
		const findId = await Teacher.findOne({ id: id }).exec()
		if (!findId)
			return res.status(401).json({ message: "Teacher do not exists" })
		const objId = findId._id
		const student = new Student({ teacher: objId, name: fullName })
		await student.save()
		await Teacher.findByIdAndUpdate(objId, {
			$addToSet: { students: student._id },
		})
		res.status(201).json({
			id: id,
			message: "User registered successfully",
		})
	} catch (error) {
		console.log(error.message)
	}
})
app.get("/student", async (req, res) => {
	try {
		const { auth } = req.headers
		const searchId = await Teacher.findOne({ id: auth })
		const student = searchId.students
		if (student.length === 0)
			return res.status(201).json({ message: "You do not have any student" })
		else res.status(200).json({ students: [...student] })
	} catch (error) {}
})
app.get("/email", async (req, res) => {
	try {
		const { id } = req.headers
		const teacher = await Teacher.findOne({ id: id })
		if (!teacher) res.status(401).json({ message: "Teacher do not exist" })
		else
			res.status(200).json({ email: teacher.email, name: teacher.name ?? null })
	} catch (error) {}
})

app.listen(PORT, () => console.log("Server started...."))
