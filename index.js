const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();
const mongoose = require("mongoose");
const Teacher = require("./dbTeacher.js");

const uri =
  "mongodb+srv://Pavlik2294:Klarnetist_0164@tutor-track.o8r5c4j.mongodb.net/tutor-track";
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas with Mongoose"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "frontend")));
app.post("/registr", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    if (!email || !password)
      return res
        .status(401)
        .json({ message: "Username and password are required" });
    const searchUser = await Teacher.findOne({ email: email });
    if (searchUser)
      return res.status(401).json({ message: "Username already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuid.v4();
    const teacher = new Teacher({
      id: id,
      email: email,
      password: hashedPassword,
    });
    await teacher.save();
    res.status(201).json({
      id: id,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(401)
        .json({ message: "Username and password are required" });

    const searchUser = await Teacher.findOne({ email: email });
    if (!searchUser)
      return res.status(401).json({ message: "Username not exists" });
    const checkPassword = bcrypt.compare(password, searchUser.password);
    if (!checkPassword)
      return res.status(401).json({ message: "Wrong password" });
    res.status(201).json({
      id: searchUser.id,
      message: "User logined successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/addstud", async (req, res) => {
  try {
    const { id, fullName } = req.body;
    if (!fullName || !id)
      return res.status(401).json({ message: "Wrong fullname or id" });
    const findId = await Teacher.findOne({ id: id }).exec();
    if (!findId)
      return res.status(401).json({ message: "Teacher do not exists" });
    if (findId.students.length !== 0) {
      const searchStudent = findId.students.find(
        (item) => item.name === fullName
      );
      if (searchStudent)
        return res.status(401).json({ message: "Student already exists" });
    }
    findId.students.push({ name: fullName });
    await findId.save();
    res.status(201).json({
      id: id,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/student", async (req, res) => {
  const { auth } = req.headers;
  const searchId = await Teacher.findOne({ id: auth });
  const student = searchId.students;
  if (student.length === 0)
    return res.status(201).json({ message: "You do not have any student" });
  else res.status(200).json({ students: [...student] });
});
app.get("/email", async (req, res) => {
  const { id } = req.headers;
  const teacher = await Teacher.findOne({ id: id });
  if (!teacher) res.status(401).json({ message: "Teacher do not exist" });
  else
    res.status(200).json({ email: teacher.email, name: teacher.name ?? null });
});
app.get("/*", (req, res) => {
  res.sendFile(path.resolve("frontend", "index.html"));
});
app.listen(4001, () => console.log("Server started...."));
