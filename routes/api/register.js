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

router.get("/:id", async(req, res) => {
    let id = req.params.id
    let user = await User.findById(id)
    if(user == null) return res.status(404).send({ message: "User not found" })
    res.status(200).send(user)
})

router.post("/", async (req, res) => {
    try {
        let fingerprint = req.body.fingerprint
        if (!fingerprint) return res.status(400).send({ message: "Invalid fingerprint" })
        
        let fingerInDb = await Fingerprint.findOne({ number: fingerprint })
        if (fingerInDb != null) return res.status(400).send({status: "banned"})

        let user = await User.findOne({ fingerprint })
        if(user) return res.status(200).send(user)

        if (!user) {
            let name = `${animals[Math.floor(Math.random() * animals.length)]} Chan`
            let profilePic = `https://avatars.dicebear.com/api/adventurer-neutral/${name.replace(/\s/g, "")}.svg?backgroundColor=variant03`
            
            let newUser = await User.create({ name, profilePic, fingerprint })
            res.status(201).send(newUser)
        }

    } catch (error) {
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
