const mongoose = require("mongoose")
const RefreshToken = new mongoose.Schema({
	token: {
		type: String,
		required: true,
		unique: true,
	},
	userType: {
		type: String,
		required: true,
		enum: ["Teacher", "Student"],
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: "userType",
	},
})
module.exports = mongoose.model("RefreshToken", RefreshToken)
