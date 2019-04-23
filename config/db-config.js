const mongoose = require('mongoose')
const path = 'mongodb://localhost:27017/URL-Shortner'
mongoose.Promise = global.Promise
mongoose.connect(path, {
    useNewUrlParser: true
}).then(() => {
    console.log('connection establish to db');
}).catch((err) => {
    console.log(err);
})
module.exports = {
    mongoose
}
