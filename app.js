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

// POSTS

app.post('/api/exercise/new-user', (req, res) => {
	let username = req.body.username;
	const userData = new User({
		username,
	});
	userData.save((err, doc) => {
		if (err) console.log(err);
		res.json({
			username: doc.username,
			_id: doc._id,
		});
	});
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
