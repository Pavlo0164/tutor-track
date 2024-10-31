const bcrypt = require("bcryptjs")
const uuid = require("uuid")
const Teacher = require("../dbTeacher.js")
class RegistrationService {
	async registartionTeacher(username, email, password, confirmPassword) {
		if (password !== confirmPassword)
			return { status: 401, message: "Passwords do not match" }
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
		return {
			status: 201,
			message: "Teacher successfully created",
			teacher: newTeacher,
		}
	}
}
module.exports = new RegistrationService()
