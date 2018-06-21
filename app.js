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

app.post('/resume', function(req, res){
	console.log( app );
	console.log( req.params );
	console.log("Work Role:  %s", req.params['Work Role'] )
	
	

  // Saving the new user to DB
  db.saveResume({
      user_name: "ERIC",
      work_role: req.params['Work Role'],
	  company: req.params['Company']
    },
    function(err, saved) {
      console.log("[DEBUG][/resume][saveResume] %s", saved);
      if(err) {
        req.send('<h1>ERROR</h1> <p>There was an error creating the account. Please try again later</p>');
        res.redirect('/resume');
        return
      }
      if(saved) {
        console.log("[DEBUG][/resume][saveResume] /chat");
        res.redirect('/chat');
      }
      else {
        req.flash('error', 'The account wasn\'t created');
        res.redirect('/resume');
        console.log("[DEBUG][/resume][saveResume] /resume");
      }
      return
    }
  );
});




server.listen(8000);
console.log('[INFO] [app.js]  Resume Application listening on port 8000...');
