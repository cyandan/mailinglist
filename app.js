// PACKAGE VARIABLES
var express    = require('express');
var app        = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

// MISC CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

// DATABASE CONNECTION
var connection = mysql.createConnection({
	host     : process.env.MYSQLHOST,
	user     : process.env.MYSQLUSER,
	password : process.env.MYSQLPW,
	database : process.env.MYSQLDB,
});

// INDEX ROUTE
app.get('/', (request, response) => {
	// DEFINE QUERY
	var q = 'SELECT COUNT(*) AS count FROM users';
	
	// RUN QUERY
	connection.query(q, (error, result) => {
		if(error) throw error;
		var emailCount = result[0].count;
		
		// SEND QUERY RESULT & RENDER INDEX PAGE
		response.render('index.ejs', {emailCount: emailCount});
	});
});

// SUBMIT ROUTE
app.post('/submit', (request, response) => {
	// RETRIEVE FORM DATA USING BODY PARSER
	var newRecipient = {email: request.body.newEmail};
	
	// ADD SUBMITTED EMAIL TO DATABASE
	connection.query('INSERT INTO users SET ?', newRecipient, (error, result) => {
		if(error) throw error;
		response.redirect("/");
	});
});

// REQUEST LISTENER CONFIG
app.listen(process.env.PORT || 3000, () => {
	console.log('Listening');
});