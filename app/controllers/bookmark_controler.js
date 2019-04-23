const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { Url } = require("../models/bookmark");
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
router.get("/bookmarks/tags/", aunthticateByUser, (req, res) => {
	const tags = req.query.names.split(",");
	Url.find({
		tags: {
			$in: tags
		},
		user: req.user._id
	})
		.then(bookmark => {
			if (bookmark.length != 0) {
				res.send(bookmark);
			} else {
				res.send(
					"Bookmarks are empty for belogs to this E-mail " + req.user.email
				);
			}
		})
		.catch(err => {
			res.send(err);
		});
});
router.get("/bookmarks", aunthticateByUser, (req, res) => {
	Url.find({
		user: req.user._id
	})
		.then(bookmark => {
			if (bookmark.length != 0) {
				res.send(bookmark);
			} else {
				res.send(
					"All Bookmarks are empty for belogs to this E-mail " + req.user.email
				);
			}
		})
		.catch(err => {
			res.send(err);
		});
});
router.get("/bookmarks/tags/all", aunthticateByUser, (req, res) => {
	const tags = req.query.names.split(",");
	Url.find({
		tags: {
			$all: tags
		},
		user: req.user._id
	})
		.then(bookmark => {
			if (bookmark.length != 0) {
				res.send(bookmark);
			} else {
				res.send(
					"All Bookmarks are empty for belogs to this E-mail " + req.user.email
				);
			}
		})
		.catch(err => {
			res.send(err);
		});
});
router.get("/:hasedURL", aunthticateByUser, (req, res, next) => {
	const hash1 = req.params.hasedURL;
	const us = req.useragent;

	function deviceType() {
		if (us.isDesktop) {
			return "Desktop";
		} else {
			return "Mobile";
		}
	}
	const diviceProps = {
		date: new Date(),
		ipAdress: req.ip,
		browserName: us.browser,
		osType: us.os,
		deviceType: deviceType()
	};
	Url.findOneAndUpdate(
		{
			hasedURL: hash1,
			user: req.user._id
		},
		{
			$push: {
				clicks: diviceProps
			}
		}
	)
		.then(bookmark => {
			if (bookmark) {
				res.redirect(bookmark.originalURL);
			} else {
				res.send("This Bookmark not belogs to this E-mail " + req.user.email);
			}
		})
		.catch(err => {
			res.send(err);
		});
});

router.post("/bookmarks", aunthticateByUser, (req, res) => {
	const bookmark = new Url(req.body);
	bookmark.user = req.user._id;
	bookmark
		.save()
		.then(bookmark => {
			res.send(bookmark);
		})
		.catch(err => {
			res.send(err);
		});
});
router.get("/bookmarks/:id", aunthticateByUser, (req, res) => {
	const id = req.params.id;
	Url.findOne({
		_id: id,
		user: req.user._id
	})
		.then(bookmark => {
			if (bookmark) {
				res.send(bookmark);
			} else {
				res.send("This Bookmark not belogs to this E-mail " + req.user.email);
			}
		})
		.catch(err => {
			res.send(err);
		});
});
router.delete("/bookmarks/:id", aunthticateByUser, (req, res) => {
	const id = req.params.id;
	Url.findOneAndDelete({
		_id: id,
		user: req.user._id
	})
		.then(bookmark => {
			if (bookmark) {
				res.send(bookmark);
			}
			res.send("This Bookmark not belogs to this E-mail " + req.user.email);
		})
		.catch(err => {
			res.send(err);
		});
});
router.put("/bookmarks/:id", aunthticateByUser, (req, res) => {
	const id = req.params.id;
	const body = req.body;

	Url.findOneAndUpdate(
		{
			_id: id,
			user: req.user._id
		},
		/*data,*/ {
			$set: body
		},
		{
			new: true
		}
		/* function (err, data) {
            if (err) res.send(err);
         }*/
	)
		.then(bookmark => {
			if (bookmark) {
				res.send(bookmark);
			} else {
				res.send("This Bookmark not belogs to this E-mail " + req.user.email);
			}
		})
		.catch(err => {
			res.send(err);
		});
});
router.get("/bookmarks/tags/:name", aunthticateByUser, (req, res) => {
	const name = req.params.name;

	Url.find({
		tags: name,
		user: req.user._id
	})
		.then(bookmarks => {
			if (bookmarks.length != 0) {
				res.send(bookmarks);
			} else {
				res.send("Those Bookmarks not belogs to this E-mail " + req.user.email);
			}
		})
		.catch(err => {
			res.send(err);
		});
});

module.exports = {
	urls: router
};
