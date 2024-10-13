const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();
const mongoose = require("mongoose");
const Teacher = require("./dbTeacher.js");
require("dotenv").config();

const URI = process.env.DATABASE_URL;
const PORT = process.env.PORT || 4001;
mongoose
  .connect(URI)
  .then(() => console.log("Connected to MongoDB Atlas with Mongoose"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "frontend")));
app.post("/registr", async (req, res) => {
  try {
    const { email, password } = req.body;

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
app.get("/checkId", async (req, res) => {
  try {
    const id = req.headers.id;
    const aliveId = await Teacher.findOne({ id: id });
    if (id === aliveId.id) {
      res.status(201).json({ status: true });
    } else {
      res.status(404).json({ message: "User not exist" });
    }
  } catch {}
});
app.get("/userInfo", async (req, res) => {
  try {
    const { id, userId } = req.headers;
    
    const check = await Teacher.findOne({ id: id });
   

    if (!check) res.status(404).json({ message: "Teacher does not exist" });
    const student = check.students.find((el) => el._id === userId);
    if (!student) res.status(404).json({ message: "Student does not exist" });
    res.status(201).json({ student: student });
  } catch {}
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
    const checkPassword = await bcrypt.compare(password, searchUser.password);
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

app.listen(PORT, () => console.log("Server started...."));
