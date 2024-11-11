const express = require("express")
const route = express.Router()
const registrationService = require("../microservices/registration.js")
route.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body
		const result = await registrationService.loginTeacher(email, password)
		res.status(result.status).json({
			message: result.message,
			accessToken: result.accessToken || undefined,
			refreshToken: result.refreshToken || undefined,
		})
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
		console.log(error)
	}
})
route.post("/registr", async (req, res) => {
	try {
		const { username, email, password, confirmPassword } = req.body
		const { status, message, teacher, accessToken, refreshToken } =
			await registrationService.registartionTeacher(
				username,
				email,
				password,
				confirmPassword
			)
		res.status(status).json({
			message: message,
			accessToken: accessToken || undefined,
			refreshToken: refreshToken || undefined,
		})
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
		console.log(error)
	}
})
module.exports = route
