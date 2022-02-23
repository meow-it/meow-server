const express = require("express")
const app = express()
const router = express.Router()
const User = require("../../schemas/UserSchema")
const Meow = require("../../schemas/MeowSchema")
const Comment = require("../../schemas/CommentSchema")
const Fingerprint = require("../../schemas/FingerprintSchema")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "Report API Online" })
})

router.post("/", async (req, res) => {

    try {

        let type = req.body.type
        if (!type) return res.status(400).send({ message: "Invalid type" })

        let id = req.body.id
        if (!id) return res.status(400).send({ message: "Invalid id" })

        let consernedId = req.body.consernedId
        if (!consernedId) return res.status(400).send({ message: "Invalid consernedId" })
        let conserned = await User.findById(consernedId)
        if(conserned == null) return res.status(400).send({ message: "Conserned User Doesn't exist" })

        let content = await getContent(id, type)
        if (content == null) return res.status(404).send({ message: "Content with ID does not exist 🙁" })  
        
        if(content.flaggedBy.includes(conserned._id)) return res.status(202).send({ message: "Already flagged by you" })
        
        await incrementFlagCountToContent(id, type, consernedId)
        
        let userId = content.madeBy
        let user = await User.findById(userId)
        
        if (user == null) return "User already got deleted"
        
        
        if(content.flaggedBy.length + 1 > 2) {
            await deleteContent(id, type)
            await addFingerprintAndDeleteUser(userId, user)
        }
        
        res.status(202).send({ message: "Content has been reported" })

    } catch (err) {
        res.status(500).send({ message: "Unable to Report 😖" })
        console.log(err)
    }
})

async function getContent(id, type) {
    let content = null
    try {
        if(type == "meow") {
            content = await Meow.findById(id)
        } else if (type == "comment") {
            content = await Comment.findById(id)
        }
    } catch (err) {
        console.log(err)
    }

    return content
}

async function incrementFlagCountToContent(id, type, consernedId) {
    try {
        if(type == "meow") {
            await Meow.findByIdAndUpdate(id, 
                { $addToSet: { flaggedBy: consernedId } }
            )
        } else if (type == "comment") {
            await Comment.findByIdAndUpdate(id, { 
                $addToSet: { flaggedBy: consernedId }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

async function deleteContent(id, type) {
    try {
        if(type == "meow") {
            await Meow.findByIdAndDelete(id)
        } else if (type == "comment") {
            await Comment.findByIdAndDelete(id)
        }
    } catch (error) {
        console.log(error)
    }
}

async function addFingerprintAndDeleteUser(userId, user) {
    let fingerprintOfUser = user.fingerprint
    await Fingerprint.create({number: fingerprintOfUser})
    await User.findByIdAndDelete(userId)
}


module.exports = router
