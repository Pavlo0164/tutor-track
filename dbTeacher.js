const mongoose = require("mongoose")
const Student = require("./dbStudent.js")
const teacher = new mongoose.Schema({
	id: String,
	email: String,
	password: String,
	students: {
		type: [Student],
		default: [],
	},
})
module.exports = mongoose.model("Teacher", teacher)
