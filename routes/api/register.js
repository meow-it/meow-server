const express = require("express")
const app = express()
const router = express.Router()
const animals = require("./animals")
const User = require("../../schemas/UserSchema")
const Fingerprint = require("../../schemas/FingerprintSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "meow meow" })
})

router.post("/", async (req, res) => {
	try {
        let fingerprint = req.body.fingerprint
		if (!fingerprint) return res.status(400).send({ message: "Invalid fingerprint" })

		let fingerInDb = await Fingerprint.findOne({ number: fingerprint })
		if (fingerInDb != null) return res.status(400).send({status: "banned"})

        let name = `${animals[Math.floor(Math.random() * animals.length)]} Chan`
        let profilePic = `https://avatars.dicebear.com/api/bottts/${name.replace(/\s/g, "")}.svg`

        let user = await User.create({ name, profilePic, fingerprint })
        res.status(201).send(user)

	} catch (err) {
		res.status(200).send({ status: false })
		console.log(err)
	}
})

router.delete("/:id", async (req, res) => {
	try {
		let id = req.params.id
		if (!id) return res.status(400).send({ message: "Invalid userid" })
		let user = await User.findByIdAndDelete(id)
		if (!user) return res.status(404).send({ message: "User with ID does not exist 🙁" })

		res.status(200).send({ status: true, message: "User deleted successfully 😭💔" })
	} catch (err) {
		console.log(`Something went wrong 😟 ${err}`)
		res.status(500).send({ message: "Something went wrong 😟" })
	}
})

module.exports = router
