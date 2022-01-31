const express = require("express")
const app = express()
const router = express.Router()
const animals = require("./animals")
const User = require("../../schemas/UserSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "meow meow" })
})
