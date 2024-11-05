require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
const mongoose = require("mongoose")
const Teacher = require("./dbTeacher.js")
const cookieParser = require("cookie-parser")

const studentRouter = require("./routes/student.js")
const authRouter = require("./routes/auth.js")
const URI = process.env.DATABASE_URL
const PORT = process.env.PORT || 4001

mongoose
	.connect(URI)
	.then(() => console.log("Connected to MongoDB Atlas with Mongoose"))
	.catch((err) => console.error("Failed to connect to MongoDB Atlas", err))

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

app.use("/student", studentRouter)
app.use("/auth", authRouter)

app.get("/email", async (req, res) => {
	try {
		const { id } = req.headers
		const teacher = await Teacher.findOne({ id: id })
		if (!teacher) res.status(401).json({ message: "Teacher do not exist" })
		else
			res.status(200).json({ email: teacher.email, name: teacher.name ?? null })
	} catch (error) {}
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

app.listen(PORT, () => console.log("Server started...."))
