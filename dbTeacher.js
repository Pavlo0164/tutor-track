const mongoose = require("mongoose")

const teacher = new mongoose.Schema({
	id: String,
	email: String,
	password: String,
})
module.exports = mongoose.model("Teacher", teacher)
