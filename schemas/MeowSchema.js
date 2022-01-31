const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MeowSchema = new Schema({
    text: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    toxic: { type: Boolean, default: false },
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    name: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    
});
let Meow = mongoose.model('Meow', MeowSchema)
module.exports = Meow;