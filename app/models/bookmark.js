const mongoose = require('mongoose')
const validator = require('validator')
const sh = require("shorthash");


const {
    Schema
} = mongoose
const urlSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    originalURL: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true

    },
    hasedURL: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    clicks: [{
        date: Date,
        ipAdress: String,
        browserName: String,
        osType: String,
        deviceType: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserBookmark'
    }
})
urlSchema.pre('save', function (next) {
    this.hasedURL = sh.unique(this.originalURL)
    next();
});
const Url = mongoose.model('Url', urlSchema)
module.exports = {
    Url
}
