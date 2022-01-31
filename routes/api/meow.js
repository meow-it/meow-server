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
                    $maxDistance: 1000
                }
            }
        })

        res.status(200).send(meows)

	} catch (err) {
		res.status(200).send({ message: "Unable to Query for some reason" })
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
