const express = require("express")
const app = express()
const router = express.Router()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

router.get("/", (_, res) => {
	res.send({ message: "meow meow" })
})

router.get("/:latitude/:longitude", async(req, res) => {
    try {
        let latitude = req.params.latitude
        let longitude = req.params.longitude

        if(!latitude || !longitude) return res.status(400).send({ message: "Invalid latitude or longitude" })

        let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        
        let response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "MeowItApp/1.0 (https://github.com/meow-it)"
            }
        })

        if (!response.ok) {
            throw new Error("Failed to fetch location data")
        }

        let locationData = await response.json()
        let payload = {
            displayName: locationData.display_name.split(", ").slice(0, 3).join(", "),
        }
        res.status(200).send(payload)

    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})

module.exports = router
