const express = require("express")
const route = express.Router()
const Student = require("../dbStudent")
const Teacher = require("../dbTeacher")

const CheckAuth = require("../microservices/checkAuth.js")

route.get("/infoOne", CheckAuth.checkToken, async (req, res) => {
	try {
		const student = await Student.findOne({ _id: req.userid })
		if (!student) res.status(404).json({ message: "Student does not exist" })
		else res.status(201).json({ student: student })
	} catch (error) {
		console.log(error.message)
	}
})
route.get("/infoAll", CheckAuth.checkToken, async (req, res) => {
	try {
		const { id } = req.user
		const student = await Student.find({ teacher: id })
		if (student.length === 0)
			return res.status(201).json({ message: "You do not have any student" })
		else res.status(200).json({ students: [...student] })
	} catch (error) {
		console.log(error.message)
	}
})
route.post("/update", CheckAuth.checkToken, async (req, res) => {
	try {
		const userID = req.headers.userid
		const student = await Student.findOne({ _id: userID })
		if (!student) res.status(404).json({ message: "Student does not exist" })
		Object.assign(student, req.body)
		await student.save()
		res.status(204).end()
	} catch (error) {
		console.log(error.message)
	}
})
route.put("/create", CheckAuth.checkToken, async (req, res) => {
	try {
		const { id } = req.user
		const { fullName } = req.body
		if (fullName)
			return res.status(401).json({ message: "Fullname is required" })
		const findId = await Teacher.findOne({ id: id }).exec()
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
route.delete("/delete", CheckAuth.checkToken, async (req, res) => {
	try {
		const { userid } = req.headers
		const student = await Student.findByIdAndDelete({ _id: userid })
		await student.save()
		if (!student) res.status(404).json({ message: "User doesn`t exists" })
		res.status(200).end()
	} catch (error) {
		console.log(error)
	}
})
module.exports = route
