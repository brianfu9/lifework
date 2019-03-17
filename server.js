var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(session({ secret: 'dogs_dont_like_me' }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
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
    //         id: int,
    //         client_id: int,
    //         client_firstname: string,
    //         client_lastname: string,
    //         client_email: string
    //         freelancer_id: int,
    //         name: string,
    //         amount: int, (number of cents)
    //         contract: string, (file location)
    //         milestones: [<milestone_object>],
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
        project_ids: matchEmails(req.body.email)
    };
    var client_id = parseInt(Object.keys(clients).length + 1);
    clients[client_id] = response;
    req.session.user = client_id;
    req.session.user_type = 'client';

    fs.writeFile('clients.json', JSON.stringify(clients), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    console.log(response);
    res.redirect("/client/project/" + "dashboard.html");
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
        if (clients[i + 1]['email'] == req.body.email) {
            user_id = i + 1;
            break;
        }
    };
    console.log('user id ' + user_id);
    if (user_id == -1) {
        res.sendFile('/client/account/login.html', { error: 'Invalid email or password.' });
    } else {
        //TODO salt/hash
        if (req.body.password == clients[user_id]['password']) {
            // sets a cookie with the user's info
            req.session.user = user_id;
            req.session.user_type = 'client';
            clients[user_id][project_ids] = matchEmails(req.body.email);
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

app.get('/logout', function (req, res) {
    req.session.destroy()
    //res.end(req.session.user);
})

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
    res.redirect('/freelancer/project/dashboard.html');
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
        if (freelancers[i + 1]['email'] == req.body.email) {
            user_id = i + 1;
            break;
        }
    };
    console.log('user id ' + user_id);
    if (user_id == -1) {
        res.sendFile(__dirname + "/public/freelancer/account/" + "login.html");
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
    var freelancer_id = parseInt(Object.keys(freelancers).length) + 1;
    freelancers[freelancer_id] = response;
    req.session.user = freelancer_id;
    req.session.user_type = 'freelancer';

    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    console.log(response);
    res.redirect("/freelancer/account/" + "addinfo.html");
})

// PROJECT
app.get('/freelancer/project/addclient.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "addclient.html");
})
app.post('/freelancer/project/addclient.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    var proj_id = parseInt(Object.keys(projects).length);
    response = {
        id: proj_id,
        client_id: -1,
        client_firstname: req.body.firstname,
        client_lastname: req.body.lastname,
        client_email: req.body.email,
        freelancer_id: req.session.user,
        name: req.body.projname,
        contract: req.body.contract,
        amount: Math.floor(parseFloat(req.body.amount) * 100),
        milestones: [],
    };
    projects[proj_id] = response;
    freelancers[req.session.user]['project_ids'].push(proj_id);
    req.session.project = proj_id;
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    fs.writeFile('projects.json', JSON.stringify(projects), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    console.log(response);
    res.redirect("/freelancer/project/" + "addmilestones.html");
})

app.get('/freelancer/project/addmilestones.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "addmilestones.html");
})
app.post('/freelancer/project/addmilestones.html/post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    var amount;
    if (req.body.unitOfMoney == 'percent') {
        amount = Math.ceil(parseFloat(req.body.amount) / 100 * projects[req.session.project]['amount']);
    } else {
        amount = Math.floor(parseFloat(req.body.amount) * 100);
    }
    response = {
        'date': req.body.date,
        'amount': amount,
        'description': req.body.desc,
        'feedback': '',
        'client_approved': false,
        'freelancer_approved': false,
        
    };
    projects[req.session.project]['milestones'].push(response);
    fs.writeFile('projects.json', JSON.stringify(projects), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    console.log(response);
    res.redirect("/freelancer/project/" + "addmilestones.html");
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
app.get('/freelancer/addstripe.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/" + "addstripe.html");
})


// API STRUCTURE
app.get('/test', function (req, res) {
    res.end(
        'current user:  ' + req.session.user + 
        '\ncurrent project:  ' + req.session.project + 
        '\nclients:     ' + JSON.stringify(clients) + 
        '\nfreelancers: ' + JSON.stringify(freelancers) + 
        '\nprojects:    ' + JSON.stringify(projects));
})

app.get('/user_name', function (req, res) {
    if (req.session.user) {
        if (req.session.user == -1) {
            res.end("");
        } else {
            res.end(freelancers[req.session.user]['firstname']);
        }
    } else {
        res.end("");
    }


})

app.get('/logged_in', function (req, res) {
    if (!req.session.user || req.session.user == -1) {
        console.log("user (not logged in) is "+ req.session.user);
        res.end("-1");
    } else {
        console.log("user is " + req.session.user);
        res.end("1")
    }
})

app.get('/projects', function (req, res) {
    var user_projects = [];
    freelancers[req.session.user]['project_ids'].forEach(function(i) {
        user_projects.push(projects[i]);
    })
    res.end(JSON.stringify(user_projects));
})

app.get('/client_projects', function (req, res) {
    var user_projects = [];
    clients[req.session.user]['email'].forEach(function(i) {
        user_projects.push(projects[i]);
    })
    res.end(JSON.stringify(user_projects));
})

app.post('/approve_milestone', urlencodedParser, function (req, res) {
    var submitted = req.body.submitbtn;
    var project_id = req.body.project_id;
    var milestone_index = req.body.milestone_index;
    console.log(project_id + ' ' + milestone_index);
    projects[project_id]['milestones'][milestone_index]['freelancer_approved'] = true;
    res.redirect("/freelancer/project/" + "dashboard.html");
})

app.post('/token', function ( req , res) {
    console.log('body is ' + req.body);
    token = req.body.token;
    console.log(token);

})

function matchEmails(client_email) {
    var project_ids = [];
    Object.keys(projects).forEach(function (proj) {
        if (client_email == projects[proj]['client_email']) {
            project_ids.push(projects[proj]['id']);
        }
    })
    return project_ids;
}

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
