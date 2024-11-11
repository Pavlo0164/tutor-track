const Teacher = require("../dbTeacher")
const jwt = require("jsonwebtoken")
class CheckAuth {
	checkToken(req, res, next) {
		const accessToken = req.headers.authorization.split(" ")[1]
		jwt.verify(accessToken, process.env.PRIVATE_KEY, async (err, decoded) => {
			if (decoded) {
				const teacher = await Teacher.findOne({ _id: decoded.id })
				if (!teacher)
					return res.status(401).json({ message: "Teacher doesn`t exist" })
				req.user = {
					username: decoded.username,
					email: decoded.email,
					role: decoded.role,
					id: decoded.id,
				}
				next()
			} else {
				return res.status(401).json({ message: err })
			}
		})
	}
	updateAccessToken() {}
}
module.exports = new CheckAuth()
