var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var TAFFY = require( 'taffy' );

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var clients = TAFFY()

app.use(express.static('public'));

// CLIENT PAGES
// account
app.get('/client/account/addpayment.html', function (req, res) {
    res.sendFile(__dirname + "/client/account/" + "addpayment.html");
})
app.post('/client/account/addpayment.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/client/account/register.html', function (req, res) {
    res.sendFile(__dirname + "/client/account/" + "register.html");
})
app.post('/client/account/register.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        first_name: req.body.firstname,
        last_name: req.body.lastname
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

// project
app.get('/client/project/approvescope.html', function (req, res) {
    res.sendFile(__dirname + "/client/project/" + "approvescope.html");
})
app.post('/client/project/approvescope.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
       
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/client/project/dashboard.html', function (req, res) {
    res.sendFile(__dirname + "/client/project/" + "dashboard.html");
})
app.post('/client/project/dashboard.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

// FREELANCER PAGES
// account
app.get('/freelancer/account/addinfo.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/account/" + "addinfo.html");
})
app.post('/freelancer/account/addinfo.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        typeOfFreelancer: req.body.typeOfFreelancer,
        lineOfWork: req.body.lineOfWork
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/freelancer/account/addpayment.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/account/" + "addpayment.html");
})
app.post('/freelancer/account/addpayment.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})
app.get('/freelancer/account/login.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/account/" + "login.html");
})
app.post('/freelancer/account/login.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})
app.get('/freelancer/account/register.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/account/" + "register.html");
})
app.post('/freelancer/account/register.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    // this is filled out
    response = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

// project
app.get('/freelancer/project/addclient.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "addclient.html");
})
app.post('/freelancer/project/addclient.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/freelancer/project/addmilestones.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "addmilestones.html");
})
app.post('/freelancer/project/addmilestones.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/freelancer/project/dashboard.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "dashboard.html");
})
app.post('/freelancer/project/dashboard.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/freelancer/project/fillmilestones.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "fillmilestones.html");
})
app.post('/freelancer/project/fillmilestones.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/freelancer/project/reviewproject.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "reviewproject.html");
})
app.post('/freelancer/project/reviewproject.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

// external
app.get('/freelancer/addstripe.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/" + "addstripe.html");
})


// misc. pages
app.get('/test.html', function (req, res) {
    res.sendFile(__dirname + "/" + "test.html");
})
app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format

    //template
    response = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})