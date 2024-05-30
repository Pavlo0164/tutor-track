const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();
app.use(bodyParser.json());
app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));
const users = [];
app.post("/registr", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(401).json({ message: "Username and password are required" });
		const searchUser = users.find((item) => item.email === email);
		if (searchUser) return res.status(401).json({ message: "Username already exists" });
		const hashedPassword = await bcrypt.hash(password, 10);
		const id = uuid.v4();
		users.push({ id: id, email: email, password: hashedPassword });
		res.status(201).json({
			id: id,
			message: "User registered successfully"
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});
app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(401).json({ message: "Username and password are required" });
		const searchUser = users.find((item) => item.email === email);
		if (!searchUser) return res.status(401).json({ message: "Username not exists" });
		const checkPassword = await bcrypt.compare(password, searchUser.password);
		if (!checkPassword) return res.status(401).json({ message: "Wrong password" });
		res.status(201).json({
			id: searchUser.id,
			message: "User logined successfully"
		});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
});
app.get("/*", (req, res) => {
	res.sendFile(path.resolve("frontend", "index.html"));
});
app.listen(4000, () => console.log("Server started...."));
