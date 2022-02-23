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
