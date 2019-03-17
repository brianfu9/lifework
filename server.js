var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var session = require('client-sessions');
var session = require('express-session');
var fs = require('fs');
var nodemailer = require('nodemailer');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(session({ secret: 'dogs_dont_like_me' }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var sess;
// sess=req.session;

// app.use(session({
//     cookieName: 'session',
//     secret: 'blarfelarg_the_great_hat_permuter',
//     duration: 60 * 60 * 1000,
//     activeDuration: 10 * 60 * 1000,
// }));
// app.use(function (req, res, next) {
//     if (req.session.user) {
//         res.setHeader('User-Id', req.session.user);
//     } else {
//         // setting a property will automatically cause a Set-Cookie response
//         // to be sent
//         req.session.user = -1;
//         res.setHeader('User-Id', -1);
//     }
// });

var transporter = nodemailer.createTransport({
    auth: {
        user: 'david@lifeworkonline.com',
        pass: 'yydysgidhrzkgngm'
    },
    host: 'smtp.gmail.com',
    port: 465,
    secure: true
});

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
//         field: string,
//         hours: string
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
//         milestones: [<milestone_object>],
//         client_email: string
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

fs.readFile('freelancers.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        obj = JSON.parse(data); //now it an object
        if (obj) freelancers = obj;
    }
});
fs.readFile('clients.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        obj = JSON.parse(data); //now it an object
        if (obj) clients = obj;
    }
});
fs.readFile('projects.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
        console.log(err);
    } else {
        obj = JSON.parse(data); //now it an object
        if (obj) projects = obj;
    }
});

app.use(express.static('public'));

//////////////////////\\\\\\\\\\\\\\\\\\\\\\
/////////////// CLIENT PAGES \\\\\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\\

// account
app.get('/client/account/addpayment.html', function (req, res) {
    res.sendFile(__dirname + "/client/account/" + "addpayment.html");
})

//TODO this
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
    var client_id = parseInt(Object.keys(clients).length);
    clients[client_id] = response;
    req.session.user = client_id;
    req.session.user_type = 'client';

    var mailOptions = {
        from: 'david@gmail.com',
        to: req.body.email,
        subject: 'Lifework Account Creation',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    fs.writeFile('clients.json', JSON.stringify(clients), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
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
    validateSession();
    res.sendFile(__dirname + "/client/project/" + "dashboard.html");
})
app.post('/client/project/dashboard.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {

    };
    console.log(response);
    res.end(JSON.stringify(response));
})


app.get('/client/account/login.html', function (req, res) {
    res.sendFile(__dirname + "/client/account/" + "login.html");
})
app.post('/client/account/login.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
        email: req.body.email,
        password: req.body.password
    };
    //TODO this
    var user_id = -1;
    for (var i = 0; i < Object.keys(clients).length; i++) {
        if (clients[i]['email'] == req.body.email) {
            user_id = i;
            break;
        }
    };
    console.log('user id ' + user_id);
    if (user_id == -1) {
        res.sendFile('/client/account/login.html', { error: 'Invalid email or password.' });
    } else {
        //TODO salt/hash
        if (req.body.password == freelancers[user_id]['password']) {
            // sets a cookie with the user's info
            req.session.user = user_id;
            req.session.user_type = 'freelancer';
            res.redirect('/client/project/dashboard.html');
        } else {
            res.sendFile(__dirname + "/public/client/account/" + "login.html");
        }
    };
    console.log(response);
    res.sendFile(__dirname + "/public/client/account/" + "login.html");
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
    freelancers[req.session.user]['field'] = req.body.lineOfWork;
    freelancers[req.session.user]['hours'] = req.body.typeOfFreelancer;
    response = {
        typeOfFreelancer: req.body.typeOfFreelancer,
        lineOfWork: req.body.lineOfWork
    };
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    console.log(response);
    res.sendFile(__dirname + "/public/freelancer/project/" + "dashboard.html");
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
        email: req.body.email,
        password: req.body.password
    };
    //TODO this
    var user_id = -1;
    for (var i = 0; i < Object.keys(freelancers).length; i++) {
        if (freelancers[i]['email'] == req.body.email) {
            user_id = i;
            break;
        }
    };
    console.log('user id ' + user_id);
    if (user_id == -1) {
        res.sendFile('/freelancer/account/login.html', { error: 'Invalid email or password.' });
    } else {
        //TODO salt/hash
        if (req.body.password == freelancers[user_id]['password']) {
            // sets a cookie with the user's info
            req.session.user = user_id;
            req.session.user_type = 'freelancer';
            res.redirect('/freelancer/project/dashboard.html');
        } else {
            res.sendFile(__dirname + "/public/freelancer/account/" + "login.html");
        }
    };
    console.log(response);
    res.sendFile(__dirname + "/public/freelancer/account/" + "login.html");
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
    req.session.user_type = 'freelancer';

    // var mailOptions = {
    //     from: 'david@gmail.com',
    //     to: req.body.email,
    //     subject: 'Lifework Account Creation',
    //     text: 'That was easy!'
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });

    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    console.log(response);
    res.redirect("/freelancer/account/" + "addinfo.html");
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
        contract: req.body.contract,
        amount: int(parseFloat(req.body.amount) * 100)
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
    console.log('hello1');
    validateSession();
    console.log('hello');
    // res.sendFile(__dirname + "/freelancer/project/" + "dashboard.html");
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
    res.end('current user:  ' + req.session.user + '\nclients:     ' + JSON.stringify(clients) + '\nfreelancers: ' + JSON.stringify(freelancers) + '\nprojects:    ' + JSON.stringify(projects));
})

app.get('/user_name', function (req, res) {
    res.end(freelancers[req.session.user]['firstname']);
})

app.get('/logged_in', function (req, res) {
    console.log(req.session.user);
    if (!req.session.user || req.session.user == -1) {
        res.end("");
    } else {
        res.end("1")
    }

})

// TODO this
function validateSession() {
    if (req.session && req.session.user) { // Check if session exists
        // lookup the user in the DB by pulling their email from the session
        console.log(req.session.user);
        if (req.session.user == -1) {
            // if the user isn't found in the DB, reset the session info and
            // redirect the user to the login page
            req.session.reset();
            res.redirect('/freelancer/account/login.html');
        } else {
            // expose the user to the template
            res.locals.user_id = req.session.user;

            // render the dashboard page
            return;
        }
    } else {
        console.log('no session');
        res.redirect('/freelancer/account/login.html');
    }
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
