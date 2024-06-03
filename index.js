const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const bcrypt = require("bcryptjs")
const uuid = require("uuid")
const app = express()
const mongoose = require("mongoose")
const Teacher = require("./dbTeacher.js")
const uri =
	"mongodb+srv://Pavlik2294:Klarnetist_0164@tutor-track.o8r5c4j.mongodb.net/tutor-track"
mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to MongoDB Atlas with Mongoose"))
	.catch((err) => console.error("Failed to connect to MongoDB Atlas", err))
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, "frontend")))
const users = []
const students = []
app.post("/registr", async (req, res) => {
	try {
		const { email, password } = req.body
		if (!email || !password)
			return res
				.status(401)
				.json({ message: "Username and password are required" })
		const searchUser = users.find((item) => item.email === email)
		if (searchUser)
			return res.status(401).json({ message: "Username already exists" })
		const hashedPassword = await bcrypt.hash(password, 10)
		const id = uuid.v4()
		const teacher = new Teacher({
			id: id,
			email: email,
			password: hashedPassword,
		})
		await teacher.save()
		res.status(201).json({
			id: id,
			message: "User registered successfully",
		})
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
})
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body
		if (!email || !password)
			return res
				.status(401)
				.json({ message: "Username and password are required" })
		const searchUser = users.find((item) => item.email === email)
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
app.get("/*", (req, res) => {
	res.sendFile(path.resolve("frontend", "index.html"))
})
app.post("/addstud", async (req, res) => {
	try {
		const { id, fullName } = req.body
		if (!fullName || !id)
			return res.status(401).json({ message: "Wrong fullname or id" })
		const findId = users.find((item) => item.id == id)
		if (!findId) return res.status(401).json({ message: "Id do not exists" })
		const searchStudent = students.find((item) => item.name === fullName)
		if (searchStudent)
			return res.status(401).json({ message: "Student already exists" })
		else students.push({ id: id, name: fullName })
		res.status(201).json({
			id: id,
			message: "User registered successfully",
		})
	} catch (error) {}
})
app.get("/students", async (req, res) => {
	const { auth } = req.headers
	const searchId = users.find((item) => item.id === auth)
	if (!searchId) return res.status(201).json({ message: "Wrong ID" })
	const student = students.filter((item) => item.id === auth)
	if (student.length === 0)
		return res.status(201).json({ message: "You do not have any student" })
	res.status(200).json({ students: student })
})
app.listen(4000, () => console.log("Server started...."))
