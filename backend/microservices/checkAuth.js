const jwt = require("jsonwebtoken")
class CheckAuth {
	checkToken(req, res, next) {
		try {
			const { accessToken } = req.headers
			if (!accessToken) res.status(401).json({ message: "Token required" })
			const { username, email, role, id } = jwt.verify(
				accessToken,
				process.env.PRIVATE_KEY
			)
			if (!username)
				res
					.status(401)
					.json({ message: "Token has expired or Invalid token" })
					.end()
			else {
				req.user = {
					username: username,
					email: email,
					role: role,
					id: id,
				}
				next()
			}
		} catch (error) {
			console.log(error)
		}
	}
}
module.exports = new CheckAuth()
