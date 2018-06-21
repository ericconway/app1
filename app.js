var express = require('express')
  , app = express()
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , server = require('http').createServer(app)
  , util = require('util')
  , db = require('./lib/resume_db.js');

app.use(express.static('public'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// set up the RethinkDB database
db.setup();


app.get('/', 
  function (req, res) {
    res.redirect('/addResume.html');
  }
)

app.get('/resume', 
  function (req, res) {
    res.redirect('/addResume.html');
  }
)

app.post('/resume', function(req, res){
	console.log("POST /resume");
	console.log( req.body );
		
  // Saving the new user to DB
  db.saveResume({
	  //TODO:  add additional fields here from form
      user_name: req.body.username,
      work_role: req.body['Work Role'],
	  company: req.body.Company
    },
    function(err, saved) {
      console.log("[DEBUG][/resume][saveResume] %s", saved);
      if(err) {
        req.write('<h1>ERROR</h1> <p>There was an error creating the account. Please try again later</p>');
        res.write('<a href="/resume">Add Resume</a>');
		res.end();
        return
      }
      if(saved) {
        console.log("[DEBUG][/resume][saveResume] /");
        res.write('<h1>SUCCESS</h1> <p>Resume Was Stored</p>');
        res.write('<a href="/resume">Add Resume</a>');
        res.end();
      }
      else {
        console.log("[ERROR][/resume][saveResume] /");
        res.write('<h1>ERROR</h1> <p>Resume Was NOT Stored</p>');
        res.write();
        res.write('<a href="/resume">Add Resume</a>');
        res.end();
      }
      return
    }
  );
});




server.listen(8000);
console.log('[INFO] [app.js]  Resume Application listening on port 8000...');
