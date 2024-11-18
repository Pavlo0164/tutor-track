const Teacher = require("../dbTeacher")
const RegistrationService = require("./registration.js")
const RefreshToken = require("../dbRefreshToken.js")
const jwt = require("jsonwebtoken")
class CheckAuth {
	updateAccessToken(res, refreshToken) {
		if (!refreshToken)
			return res.status(402).json({ message: "Refresh token is required" })
		jwt.verify(refreshToken, process.env.PRIVATE_KEY, async (err, decoded) => {
			if (err)
				return res.status(402).json({ message: "Refresh token is not valid" })
			if (decoded) {
				const teacher = await Teacher.findOne({ _id: decoded.id })
				if (!teacher)
					return res.status(402).json({ message: "Teacher doesn`t exist" })
				const { username, email, role, id } = decoded
				const newAccessToken = RegistrationService.createJwtToken(
					username,
					email,
					role,
					id,
					"30m"
				)
				const newRefreshToken = RegistrationService.createJwtToken(
					username,
					email,
					role,
					id,
					"30d"
				)
				const refreshToken = await RefreshToken.findOne({ userId: id })
				if (refreshToken) {
					refreshToken.token = newRefreshToken
					await refreshToken.save()
				} else {
					const createNewRefreshTokenInDb = await RefreshToken.create({
						token: newRefreshToken,
						userType: role,
						userId: id,
					})
					await createNewRefreshTokenInDb.save()
				}

				return res.status(201).json({
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				})
			}
		})
	}
	checkToken(req, res, next) {
		const accessToken = req.headers.authorization?.split(" ")[1]
		jwt.verify(accessToken, process.env.PRIVATE_KEY, async (err, decoded) => {
			if (err) {
				return res.status(401).json({ message: err })
			}
			if (decoded) {
				const teacher = await Teacher.findOne({ _id: decoded.id })
				if (!teacher)
					return res.status(402).json({ message: "Teacher doesn`t exist" })
				req.user = {
					username: decoded.username,
					email: decoded.email,
					role: decoded.role,
					id: decoded.id,
				}
				next()
			}
		})
	}
}
module.exports = new CheckAuth()
