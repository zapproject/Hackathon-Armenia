const express = require('express');
const bodyParser = require('body-parser');

const oracle = require('./oracle/oracle.js');

const port = process.env.PORT || 3000;

// Create the app
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
        var now = new Date().toString();
        var log = `${req.ip} | ${now} | ${req.method} ${req.url}`;

        console.log(log);
        next();
});

app.use(express.static(__dirname + '/frontend'));

router.use(function(req, res, next) {
    console.log('Something is happening...');
    next();
});

router.route('/validate')
	.post((req, res) => {
		let source_data = req.body.source_data;
		let user_data = req.body.user_data;
		let user_bid = req.body.user_bid;

		let result = oracle.doValidation(source_data, user_data, user_bid);
		res.json(result);
	});

router.get('/', (req, res) => {
	res.json({message: 'Triengine Oracle welcomes you to its API.'});
});

app.use('/api', router);

app.listen(port, () => {
	console.log(`Server started on port ${port}...`);
});
