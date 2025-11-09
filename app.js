const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
require("./database")
const { cors } = require("./middleware")
const port = process.env.PORT || 3003

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
const registerAPI = require("./routes/api/register")
const meowAPI = require("./routes/api/meow")
const commentAPI = require("./routes/api/comment")
const reportAPI = require("./routes/api/report")
const reverseGeocodeAPI = require("./routes/api/reverse-geocode")

app.use("/api/register", cors, registerAPI)
app.use("/api/meow", cors, meowAPI)
app.use("/api/comment", cors, commentAPI)
app.use("/api/report", cors, reportAPI)
app.use("/api/reverse-geocode", cors, reverseGeocodeAPI)

app.get("/", (_, res) => {
	res.status(200).send({ text: "Hello World!"})
})
