const mongoose = require("mongoose")
let secondsToLive = 24 * 60 * 60
const Schema = mongoose.Schema;
const MeowSchema = new Schema({
    text: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    toxic: { type: Boolean, default: false },
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    name: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isReviewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: { expireAfterSeconds: secondsToLive } },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
});

MeowSchema.index({ location: '2dsphere' });

let Meow = mongoose.model('Meow', MeowSchema)
module.exports = Meow;