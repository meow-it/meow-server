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
        if (!user) return res.status(404).send({ status: false, message: "User with ID not found 🙁" })

        if (!text) return res.status(400).send({ message: "Comment Text cannot be null 😦" })
        text = text.substring(0, 140)

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

router.put("/review", async (req, res) => {

    try {

        let { userId, commentId } = req.body

        if (!userId) return res.status(400).send({ message: "Does not have an userId" })
        if (!commentId) return res.status(400).send({ message: "Does not have a commentId" })

        let user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: "User with ID not found 🙁" })

        let comment = await Comment.findById(commentId)
        if (!comment) return res.status(404).send({ message: "Comment with ID not found 🙁" })

        if(comment.toxic) return res.status(400).send({ message: "Comment is already labeled as toxic 🙁" })
        if(comment.isReviewed) return res.status(400).send({ message: "Comment has already been sent for review 😒" })

        res.status(202).send({ message: "Comment has been sent for review 😏" })

        await Comment.findByIdAndUpdate(commentId, { $set: { isReviewed: true } })
        
        // TODO: Handle Review with the Toxic API 
        // Instead: Checking the text again for profane words

        if(deepSearchForProfane(comment.text)) {
            await Comment.findByIdAndUpdate(commentId, { $set: { toxic: true } })
        }

    } catch (err) {
        res.status(500).send({ message: "Unable to review the comment. Try again 😖" })
        console.log(err)        
    }

})

function deepSearchForProfane(string) {

    for (let i = 0; i < stuff.length; i++) {
        if (string.toLowerCase().includes(stuff[i])) return true
    }

    return false
}

function hasProfane(string) {
    let elements = string.split(" ")
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        if (stuff.includes(element.toLowerCase())) {
            return true
        }
    }

    return false
}

module.exports = router
