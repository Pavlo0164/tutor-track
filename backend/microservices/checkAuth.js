const jwt = require("jsonwebtoken")
class CheckAuth {
	checkToken(req, res, next) {
		const accessToken = req.headers.authorization.split(" ")[1]
		if (!accessToken) res.status(401).json({ message: "Token required" })
		const decoded = jwt.verify(accessToken, process.env.PRIVATE_KEY)
		if (!decoded)
			res.status(401).json({ message: "Token has expired or Invalid token" })
		else {
			req.user = {
				username: decoded.username,
				email: decoded.email,
				role: decoded.role,
				id: decoded.id,
			}
			next()
		}
	}
}
module.exports = new CheckAuth()
