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

router.post("/new", async (req, res) => {

    try {

        let { meowId, userId, text } = req.body
        if(!meowId || !userId || !text) return res.status(400).send({ message: "Make sure you sent all the required fields 🙁: meowId, userId, text" })

        let meow = await Meow.findById(meowId)
        if (!meow) return res.status(404).send({ message: "Meow with ID not found 🙁" })

        let user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: "User with ID not found 🙁" })

        if (!text) return res.status(400).send({ message: "Comment Text cannot be null 😦" })

        let toxic = hasProfane(text)
        let name = user.name
        let profilePic = user.profilePic

        let comment = await Comment.create({ text, toxic, name, profilePic, commentedTo: meowId })
        res.status(201).send(comment)

        await Meow.findByIdAndUpdate(meowId, { $push: { comments: comment._id } })
        
    } catch (err) {
        res.status(500).send({ message: "Unable to Create New Meow 😖" })
        console.log(err)
    }
})
