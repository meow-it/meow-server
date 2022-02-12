const express = require("express")
const app = express()
const router = express.Router()
const User = require("../../schemas/UserSchema")
const Meow = require("../../schemas/MeowSchema")
const Comment = require("../../schemas/CommentSchema")
const stuff = require("./stuff")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "Comments API Online" })
})

router.get("/:id", async (req, res) => {
	
    try {

        let meowId = req.params.id
        let meow = await Meow.findById(meowId).populate({ path: "comments", options: { sort: { createdAt: -1 } } })
        
        if (!meow) return res.status(404).send({ message: "Meow with ID not found 🙁" })
        
        res.status(200).send(meow.comments)
	} catch (err) {
		res.status(200).send({ message: "Make sure you sent a correct meowid. Unable to Query for some reason 😦" })
		console.log(err)
	}
})
