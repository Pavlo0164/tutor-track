require("dotenv").config()
const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")



const mongoose = require("mongoose")
const Teacher = require("./dbTeacher.js")

const studentRouter = require("./routes/student.js")
const authRouter = require("./routes/auth.js")

const CheckAuth = require("./microservices/checkAuth.js")

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

app.get("/email", CheckAuth.checkToken, (req, res) => {
	try {
		const { username, email, role, id } = req.user
		res.status(200).json({ email: email, name: username })
	} catch (error) {}
})
app.get("/checkToken", CheckAuth.checkToken, (req, res) => {
	try {
		res.status(200).end()
	} catch (error) {
		console.log(error)
	}
})

app.listen(PORT, () => console.log("Server started...."))
