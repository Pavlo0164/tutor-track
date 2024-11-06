require("dotenv").config()
const bcrypt = require("bcryptjs")
const Teacher = require("../dbTeacher.js")
const jwt = require("jsonwebtoken")
const RefreshToken = require("../dbRefreshToken.js")

class RegistrationService {
	createJwtToken(username, email, role, id, timeOfLife) {
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

			const newTeacher = await Teacher.create({
				name: username,
				email: email,
				password: hashedPassword,
			})
			await newTeacher.save()
			const refreshToken = this.createJwtToken(
				username,
				email,
				newTeacher.role,
				newTeacher._id,
				"90d"
			)
			const accessToken = this.createJwtToken(
				username,
				email,
				newTeacher.role,
				newTeacher._id,
				"30m"
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
				accessToken: accessToken,
			}
		} catch (err) {
			console.log(err)
		}
	}
	async loginTeacher(emailTeacher, passwordUser) {
		try {
			const teacher = await Teacher.findOne({
				email: emailTeacher,
			})
			if (!teacher)
				return {
					status: 401,
					message: "Username not exists",
				}
			const checkPassword = await bcrypt.compare(passwordUser, teacher.password)
			if (!checkPassword) return { status: 401, message: "Wrong password" }

			const refreshToken = await RefreshToken.findOne({ userId: teacher._id })
			const newRefreshToken = this.createJwtToken(
				teacher.name,
				teacher.email,
				teacher.role,
				teacher._id,
				"90d"
			)
			const newAccessToken = this.createJwtToken(
				teacher.name,
				teacher.email,
				teacher.role,
				teacher._id,
				"30m"
			)
			if (refreshToken) {
				refreshToken.token = newRefreshToken
				await refreshToken.save()
			} else {
				const newRefreshToken = await RefreshToken.create({
					token: newRefreshToken,
					userType: teacher.role,
					userId: teacher._id,
				})
				await newRefreshToken.save()
			}
			return {
				status: 200,
				message: "Login is successfull",
				accessToken: newAccessToken,
			}
		} catch (err) {
			console.log(err)
		}
	}
}
module.exports = new RegistrationService()
