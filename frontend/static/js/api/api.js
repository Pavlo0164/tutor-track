//import axios from "axios"
import { URL } from "../config/config.js"
export const login = async (info) => {
	try {
		const reg = await fetch(URL + "/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(info),
		})
		const data = await reg.json()
		if (!reg.ok) return { message: data.message }
		sessionStorage.setItem("accessToken", data.accessToken)
		document.cookie = `refreshToken=${data.refreshToken};max-age=${
			90 * 24 * 60 * 60
		};path=/;SameSite=None;Secure`
		return data
	} catch (err) {
		console.log(err)
	}
}
export const registr = async (info) => {
	const reg = await fetch(URL + "/auth/registr", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(info),
	})
	const data = await reg.json()
	if (!reg.ok) return { message: data.message }
	sessionStorage.setItem("accessToken", data.accessToken)
	document.cookie = `refreshToken=${data.refreshToken};max-age=${
		90 * 24 * 60 * 60
	};path=/;SameSite=None;Secure`
	return data
}
export const createStudent = async (token, nameOfStudent) => {
	const newStud = await fetch(URL + "/student/create", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			fullName: nameOfStudent,
		}),
	})
	return newStud.ok
}
export const checkAuth = async (token) => {
	try {
		const response = await axios.get(URL + "/checkToken", {
			headers: {
				authorization: `Bearer ${token}`,
			},
		})
		return response
	} catch (error) {
		return error.response
	}
}
export const getUserInfo = async (token) => {
	const res = await fetch(URL + "/email", {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
	})
	const data = await res.json()
	const answer = {
		status: res.status,
		status: res.statusText,
		name: data.name || undefined,
		email: data.email || undefined,
	}
	return answer
}
export const getAllStudents = async (token) => {
	const response = await fetch(URL + "/student/infoAll", {
		method: "GET",
		headers: {
			authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok)
		throw new Error(`Error : ${response.status} ${response.statusText}`)
	const body = await response.json()
	return body.students
}
export const getOneStudent = async (token, userId) => {
	const res = await fetch(URL + "/student/infoOne", {
		method: "GET",
		headers: {
			userid: userId,
			authorization: `Bearer ${token}`,
		},
	})
	if (!res.ok) throw new Error(`Error : ${res.status} ${res.statusText}`)
	const data = await res.json()
	return { data, userId }
}
export const deleteStudent = async (token, userId) => {
	const deleteStud = await fetch(URL + "/student/delete", {
		method: "DELETE",
		headers: {
			userid: userId,
			authorization: `Bearer ${token}`,
		},
	})
	return deleteStud.ok
}
export const updateStudentInfo = async (token, userId, updatedData) => {
	const sendData = await fetch(URL + "/student/update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			userid: userId,
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(updatedData),
	})
	return sendData.ok
}
