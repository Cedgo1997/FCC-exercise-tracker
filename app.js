const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// to parse POST bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Models
const User = require('./models/user.model');

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

// METHODS

// ADD USER
const addUser = (username, done) => {
	const userData = new User({
		username,
	});
	userData.save((err, data) => {
		if (err) done(err);
		done(null, data);
	});
};

// POST

app.post('/api/exercise/new-user', (req, res) => {
	let username = req.body.username;
	addUser(username, (err, data) => {
		if (err) {
			if (err.code == 11000) {
				res.send('Username already taken');
			} else {
				res.send('ERROR');
			}
		}
		res.json({
			username: data.username,
			_id: data._id,
		});
	});
});

// GET ALL USERS

app.get('/api/exercise/users', (req, res) => {
	User.find({})
		.select('username _id')
		.exec((err, data) => {
			err ? res.send(err) : res.json({ users: data });
		});
});

// ADD EXERCISE

app.post('/api/exercise/add', (req, res) => {
	const { id, description, duration } = req.body;
	User.findByIdAndUpdate(
		id,
		{
			$push: {
				exercises: {
					description,
					duration: Number(duration),
					date: req.body.date
						? new Date(req.body.date).toDateString()
						: new Date().toDateString(),
				},
			},
		},
		{ new: true },
		(err, data) => {
			if (data == null) {
				res.send('You must fill all fields correctly');
			}
			res.json({
				username: data.username,
				_id: data._id,
				description,
				duration,
				date: req.body.date
					? new Date(req.body.date).toDateString()
					: new Date().toDateString(),
			});
		}
	);
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
