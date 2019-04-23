const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
userSchema = new Schema({
	username: {
		type: String,
		minlength: 3,
		requrired: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function(value) {
				return validator.isEmail(value);
			},
			massage: function() {
				return "invalid email fromat";
			}
		}
	},
	password: {
		type: String,
		minlength: 4,
		maxlength: 128,
		requrired: true,
		validate: {
			validator: function(value) {
				validator.isEmpty(value);
			}
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	tokens: [
		{
			token: {
				type: String
			}
		}
	]
});

//generate password encrprition hide the original password
userSchema.pre("save", function(next) {
	if (this.isNew) {
		bcryptjs.genSalt(10).then(salt => {
			bcryptjs.hash(this.password, salt).then(hashedpassword => {
				this.password = hashedpassword;
				next();
			});
		});
	} else {
		next();
	}
});
//user aunthticate
userSchema.statics.findByCredentials = function(email, password) {
	return UserBookmark.findOne({
		email
	})
		.then(user => {
			if (user) {
				return bcryptjs.compare(password, user.password).then(result => {
					if (result) {
						return Promise.resolve(user);
					} else {
						return Promise.reject("invalid email or password ");
					}
				});
			} else {
				return Promise.reject("invaild email or password");
			}
		})
		.catch(err => {
			return Promise.reject(err);
		});
};
//generate a particuler user tokens to aceess only thier data
userSchema.methods.generateToken = function() {
	const user = this; //refere to current object(user)
	const data = {
		userId: user._id
	};
	const token = jwt.sign(data, "9849084994");
	user.tokens.push({
		token
	});
	return user
		.save()
		.then(user => {
			return token;
		})
		.catch(err => {
			return err;
		});
};
const UserBookmark = mongoose.model("UserBookmark", userSchema);
module.exports = {
	UserBookmark
};
