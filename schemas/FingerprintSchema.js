const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const FingerprintSchema = new Schema({
    number: { type: String, required: true, trim: true }
}, { timestamps: true })

let Fingerprint = mongoose.model('Fingerprint', FingerprintSchema)
module.exports = Fingerprint;