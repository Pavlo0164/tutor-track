const mongoose = require("mongoose")
const teacher = new mongoose.Schema({
	role: { type: String, default: "Teacher" },
	id: String,
	name: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
	students: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
		default: [],
	},
})
module.exports = mongoose.model("Teacher", teacher)
