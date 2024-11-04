const mongoose = require("mongoose")
const student = new mongoose.Schema({
	role: { type: String, default: "Student" },
	teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
	name: String,
	surname: {
		type: String,
		default: null,
	},
	city: {
		type: String,
		default: null,
	},
	birthday: {
		type: String,
		default: null,
	},
	sex: {
		type: String,
		default: null,
	},
	phone: {
		type: String,
		default: null,
	},
	parentsPhone: {
		type: String,
		default: null,
	},
	email: {
		type: String,
		default: null,
	},
	communication: {
		type: [String],
		default: null,
	},
	linkOnLesson: {
		type: String,
		default: null,
	},
	subject: {
		type: String,
		default: null,
	},
	startOfTheStudy: {
		type: String,
		default: null,
	},
	sessionDuration: {
		type: String,
		default: null,
	},
	costOfLesson: {
		type: Number,
		default: null,
	},
})
module.exports = mongoose.model("Student", student)
