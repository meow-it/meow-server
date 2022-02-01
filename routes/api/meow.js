const express = require("express")
const app = express()
const router = express.Router()
const User = require("../../schemas/UserSchema")
const Meow = require("../../schemas/MeowSchema")
const stuff = require("./stuff")

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "meow meow" })
})

router.post("/all", async (req, res) => {
	
    try {
        let latitude = parseFloat(req.body.latitude)
        let longitude = parseFloat(req.body.longitude)

        if (!latitude || !longitude) return res.status(400).send({ message: "Invalid coordinates" })

        let meows = await Meow.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 5000
                }
            }
        })

        res.status(200).send(meows)

	} catch (err) {
		res.status(200).send({ message: "Unable to Query for some reason" })
		console.log(err)
	}
})

router.post("/new", async (req, res) => {
    try {

        let userid = req.body.userid
        if (!userid) return res.status(400).send({ message: "Invalid userid" })

        let user = await User.findById(userid)
        if (!user) return res.status(400).send({ message: "User Does not Exist" })

        let text = req.body.text
        if (!text) return res.status(400).send({ message: "Text Cannot be Null" })

        let toxic = hasProfane(text)
        let name = user.name
        let profilePic = user.profilePic

        let latitude = parseFloat(req.body.latitude)
        let longitude = parseFloat(req.body.longitude)

        if (!latitude || !longitude) return res.status(400).send({ message: "Invalid coordinates" })

        let location = {
            type: "Point",
            coordinates: [longitude, latitude]
        }

        let meow = await Meow.create({
            text,
            toxic,
            location,
            name,
            profilePic
        })

        res.status(201).send(meow)

        await User.findByIdAndUpdate(userid, {
            $push: {
                meows: meow._id
            }
        })

        
    } catch (err) {
        res.status(500).send({ message: "Unable to Create New Meow 😖" })
        console.log(err)
    }
})

router.put("/like", async (req, res) => {

    try {
        let like = 1

        let userid = req.body.userid
        if (!userid) return res.status(400).send({ message: "Invalid userid" })

        let meowid = req.body.meowid
        if (!meowid) return res.status(400).send({ message: "Invalid meowid" })

        let meow = await Meow.findById(meowid)
        if (!meow) return res.status(400).send({ message: "Meow Does not Exist" })

        like = req.body.like !== undefined ? req.body.like : like

        let option = like ? "$addToSet" : "$pull"
        
        res.sendStatus(202)

        await Meow.findByIdAndUpdate(meowid, {
            $inc: { likes: like },
            [option]: { likedBy: userid }
        })


    } catch (err) {
        res.status(500).send({ message: "Unable to Like Meow 😖" })
        console.log(err)        
    }

})

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
