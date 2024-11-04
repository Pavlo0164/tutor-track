require("dotenv").config()
const bcrypt = require("bcryptjs")
const uuid = require("uuid")
const Teacher = require("../dbTeacher.js")
const jwt = require("jsonwebtoken")
const RefreshToken = require("../dbRefreshToken.js")
class RegistrationService {
	createRefreshToken(username, email, role, id, timeOfLife) {
		return jwt.sign({ username, email, role, id }, process.env.PRIVATE_KEY, {
			expiresIn: timeOfLife,
		})
	}
	async registartionTeacher(username, email, password, confirmPassword) {
		if (password !== confirmPassword)
			return { status: 401, message: "Passwords do not match" }
		try {
			const teacher = await Teacher.findOne({ email })
			if (teacher) return { status: 401, message: "Username already exists" }
			const hashedPassword = await bcrypt.hash(password, 10)
			const id = uuid.v4()
			const newTeacher = await Teacher.create({
				id: id,
				name: username,
				email: email,
				password: hashedPassword,
			})
			await newTeacher.save()
			const refreshToken = this.createRefreshToken(
				username,
				email,
				newTeacher.role,
				id,
				"90d"
			)
			const newRefreshToken = await RefreshToken.create({
				token: refreshToken,
				userType: newTeacher.role,
				userId: newTeacher._id,
			})
			await newRefreshToken.save()
			return {
				status: 201,
				message: "Teacher successfully created",
				teacher: newTeacher,
			}
		} catch (err) {
			console.log(err)
		}
	}
}
module.exports = new RegistrationService()
