const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
	name: { type: String, required: true, trim: true },
    profilePic: { type: String },
    meows: [{ type: Schema.Types.ObjectId, ref: "Meow" }],
    
}, { timestamps: true });

let User = mongoose.model('User', UserSchema)
module.exports = User;