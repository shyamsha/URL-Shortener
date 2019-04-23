const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { UserBookmark } = require("../models/user");

function aunthticateByUser(req, res, next) {
	let token = req.header("x-auth");
	let tokendata;
	try {
		tokendata = jwt.verify(token, "9849084994");
	} catch (err) {
		res.send(err);
	}
	UserBookmark.findOne({
		_id: tokendata.userId,
		"tokens.token": token
	})
		.then(user => {
			req.user = user;
			req.token = token;
			next();
		})
		.catch(err => {
			res.send(err);
		});
	//    console.log(tokendata)
}
router.post("/register", (req, res) => {
	const user = new UserBookmark(req.body);
	user
		.save()
		.then(user => {
			res.send(user);
		})
		.catch(err => {
			res.send(err);
		});
});
router.post("/login", (req, res) => {
	const body = req.body;
	//static method
	UserBookmark.findByCredentials(body.email, body.password)
		.then(user => {
			//instance method
			return user.generateToken();
			//res.send('successfully logedin')
		})
		.then(token => {
			res.header("x-auth", token).send();
			// res.send(token)
		})
		.catch(err => {
			res.send(err);
		});
});
router.delete("/logout", aunthticateByUser, (req, res) => {
	const token = req.header;
	UserBookmark.findOneAndDelete({
		$pull: {
			tokens: {
				token: token
			}
		}
	})
		.then(user => {
			user.save().then(() => {
				res.send("suceessfully token delete");
			});
		})
		.catch(err => {
			res.send(err);
		});
});
router.delete("/logoutall", aunthticateByUser, (req, res) => {
	UserBookmark.findByIdAndDelete(
		{
			_id: req.user._id
		},
		{
			$set: {
				tokens: {
					token: []
				}
			}
		}
	)
		.then(user => {
			user.save().then(user => {
				res.send("suceessfully all tokens destroyed");
			});
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = {
	userrouters: router
};
