require("dotenv").config()
const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")

const mongoose = require("mongoose")

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
	const { username, email } = req.user
	res.status(200).json({ email: email, name: username })
})
app.post("/updateToken", (req, res) => {
	const { refreshToken } = req.body
	CheckAuth.updateAccessToken(res, refreshToken)
})
app.get("/checkToken", CheckAuth.checkToken, (req, res) => {
	res.status(200).end()
})

app.listen(PORT, () => console.log("Server started...."))
