var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('client-sessions');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(session({
    cookieName: 'session',
    secret: 'blarfelarg_the_great_hat_permuter',
    duration: 60 * 60 * 1000,
    activeDuration: 10 * 60 * 1000,
}));

var clients = {}
// clients = {
//     id: {
//         firstname: string,
//         lastname: string,
//         email: string,
//         password: long,
//         project_ids: [int]
//     }
// }
var freelancers = {}
// freelancers = {
//     id: {
//         firstname: string,
//         lastname: string,
//         email: string,
//         password: long,
//         project_ids: [int]
//     }
// }
var projects = {}
// projects = {
//     id: {
//         client_id: int,
//         freelancer_id: int,
//         name: string,
//         amount: int, (number of cents)
//         contract: string, (file location)
//         milestones: [<milestone_object>]
//     }
// }
// milestone_object = {
//     date: date_object,
//     amount: int, (number of cents)
//     description: string,
//     feedback: string,
//     client_approved: boolean,
//     freelancer_approved: boolean
// }

app.use(express.static('public'));

//////////////////////\\\\\\\\\\\\\\\\\\\\\\
/////////////// CLIENT PAGES \\\\\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\\

// account
app.get('/client/account/addpayment.html', function (req, res) {
    res.sendFile(__dirname + "/client/account/" + "addpayment.html");
})
app.post('/client/account/addpayment.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        project_ids: []
    };
    clients[parseInt(Object.keys(clients).length)] = response;
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

////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\
/////////////// FREELANCER PAGES \\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\

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
    req.session.user = user;
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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        project_ids: []
    };
    var freelancer_id = parseInt(Object.keys(freelancers).length);
    freelancers[freelancer_id] = response;
    req.session.user = freelancer_id;
    req.session.user_type = 'freelancer'
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
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        name: req.body.projname,
        contract: req.body.contract
    };
    // var proj_id = parseInt(Object.keys(projects).length);
    // projects[proj_id] = response;
    // freelancers[req.session.user]['project_ids'].push(proj_id);
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
app.get('/test', function (req, res) {
    res.end('clients:     ' + JSON.stringify(clients) + '\nfreelancers: ' + JSON.stringify(freelancers) + '\nprojects:    ' + JSON.stringify(projects));
})

// TODO this
function validateSession() {
    if (req.session && req.session.user) { // Check if session exists
        // lookup the user in the DB by pulling their email from the session
        User.findOne({ email: req.session.user.email }, function (err, user) {
            if (!user) {
                // if the user isn't found in the DB, reset the session info and
                // redirect the user to the login page
                req.session.reset();
                res.redirect('/login');
            } else {
                // expose the user to the template
                res.locals.user = user;

                // render the dashboard page
                res.render('dashboard.jade');
            }
        });
    } else {
        res.redirect('/login');
    }
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
