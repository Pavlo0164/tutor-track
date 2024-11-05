const express = require("express")
const route = express.Router()
const registrationService = require("../microservices/registration.js")

route.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body
		const { status, message, accessToken } =
			await registrationService.loginTeacher(email, password)

		res.status(status).json({
			message: message,
			accessToken: accessToken || undefined,
		})
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
		console.log(error)
	}
})
route.post("/registr", async (req, res) => {
	try {
		const { username, email, password, confirmPassword } = req.body
		const { status, message, teacher, accessToken } =
			await registrationService.registartionTeacher(
				username,
				email,
				password,
				confirmPassword
			)
		res.status(status).json({
			message: message,
			accessToken: accessToken || "",
		})
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
})
module.exports = route
