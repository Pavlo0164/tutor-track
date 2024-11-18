import { URL } from "../config/config.js"
axios.defaults.headers.common = {
	"Content-Type": "application/json",
}
const firstApiAxios = axios.create()
firstApiAxios.interceptors.request.use((config) => {
	config.headers["authorization"] = `Bearer ${sessionStorage.getItem(
		"accessToken"
	)}`
	return config
})
firstApiAxios.interceptors.response.use(
	(res) => res,
	async (err) => {
		const originalRequest = err.config
		if (axios.isAxiosError(err) && err.response?.status === 401) {
			const { data } = await firstApiAxios.post(URL + "/updateToken", {
				refreshToken: Cookies.get("refreshToken"),
			})
			sessionStorage.setItem("accessToken", data.accessToken)
			Cookies.set("refreshToken", data.refreshToken, { expires: 30 })
			originalRequest.headers["authorization"] = `Bearer ${data.accessToken}`
			return firstApiAxios(originalRequest)
		}
		return err
	}
)
export const login = async (info) => {
	try {
		const reg = await axios.post(URL + "/auth/login", info)
		sessionStorage.setItem("accessToken", reg.data.accessToken)
		Cookies.set("refreshToken", reg.data.refreshToken, { expires: 30 })
		return reg
	} catch (err) {
		return err.statusText
	}
}
export const registr = async (info) => {
	try {
		const reg = await axios.post(URL + "/auth/registr", info)
		sessionStorage.setItem("accessToken", reg.data.accessToken)
		Cookies.set("refreshToken", reg.data.refreshToken, { expires: 30 })
		return reg
	} catch (err) {
		return { message: err.response.statusText }
	}
}
export const createStudent = async (nameOfStudent) => {
	try {
		const response = await firstApiAxios.put(URL + "/student/create", {
			fullName: nameOfStudent,
		})
		return response.status
	} catch (err) {
		return false
	}
}
export const checkAuth = async () => {
	try {
		const response = await firstApiAxios.get(URL + "/checkToken")
		return response
	} catch (error) {
		console.log(error.response)

		return error.response
	}
}

export const getUserInfo = async () => {
	try {
		const response = await firstApiAxios.get(URL + "/email")
		return response.data
	} catch (err) {
		return err.response
	}
}
export const getAllStudents = async () => {
	try {
		const { data } = await firstApiAxios.get(URL + "/student/infoAll")
		return data.students
	} catch (err) {
		throw new Error(`Error : ${err.status} ${err.statusText}`)
	}
}
export const getOneStudent = async (userId) => {
	try {
		const res = await firstApiAxios.get(URL + "/student/infoOne", {
			headers: {
				userid: userId,
			},
		})
		const answer = {
			data: res.data,
			userId: userId,
		}
		return answer
	} catch (err) {
		throw new Error(`Error : ${err.status} ${err.statusText}`)
	}
}
export const deleteStudent = async (userId) => {
	const deleteStud = await firstApiAxios.delete(URL + "/student/delete", {
		headers: {
			userid: userId,
		},
	})
	return deleteStud.status
}
export const updateStudentInfo = async (userId, updatedData) => {
	const sendData = await firstApiAxios.post(
		URL + "/student/update",
		updatedData,
		{
			headers: {
				userid: userId,
			},
		}
	)
	return sendData.status
}
