var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
//might not need this path variable
var path = require('path');
var bcrypt = require('bcrypt'); // hashing
/* var aws = require('aws-sdk'); //aws s3 */

/*

    ~~~MongoDB Server~~~
    Table: (slightly different format)
    1) id : number
    2) object : dictionary
    
    Rules:
    1) Every time we query, we look up by ID and then return the values item as an array
    2) Every time we update, 
*/
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');



var database;
// Connection URL
//const url = ('mongodb://@%s:%s/', host, port);
const url = ('mongodb://localhost:27017/'); /* localboi */
//const url = ('mongodb+srv://jchernof:securePass@lwdbcluster-rpprd.mongodb.net/test?retryWrites=true');
//const url = ('mongodb+srv://jchernof:securePass@lwdbcluster-rpprd.mongodb.net/test?ssl=true&authSource=admin');
console.log("url");
//http://%s:%s", host, port
// Use connect method to connect to the Server
const client = new MongoClient(url);
var lwdb, freelancers_db, clients_db, projects_db;

/* WRITE */
// var d = {
//     id: {

//     }
// }
// freelancers_db.insert(d, (err, result) => {
//     console.log(err || "successful input");
// });

/* READ */
// console.log(freelancers_db.find({id:'1'}).toArray());
/* freelancers_db = client.db('freelancers');
freelancers_db.find({id:1}).toArray(function(err, docs) {
    if (err) {
        console.log(err)
    } else {
        console.log("%s records found", docs.length);
    }
  });
*/
setTimeout(function () { console.log("Waiting"); }, 3000);




// var awsKey = require('./apikey'); //aws s3 keys (NEED TO UPLOAD YOUR OWN apikey.js file in root directory if running on localhost)


// Configure aws
/*
Note about AWS: this (should) download files from AWS every time the server starts up.
Any time a user action is taken, the files in AWS are re-written. 
Not sure if this logic is foolproof^. (But I think it is).
*/

/* Uncomment if running on localhost */
// aws.config.update({ 
//     accessKeyId: awsKey['key'],
//     secretAccessKey: awsKey['secret']
// });
// var s3 = new aws.S3();


// Uncomment if running on heroku
/*
let s3 = new aws.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET
});
var bucket = "lifeworkonlinebucket";

*/
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
//     id: client_id, (int)
//     firstname: req.body.firstname, (string)
//     lastname: req.body.lastname, (string)
//     email: req.body.email, (string)
//     password: p, (string)
//     project_ids: matchEmails(req.body.email), (string)
//     timestamp: time, (int)
//     hasPayment: false (boolean)
// }
// 
var freelancers = {}
// freelancers = {
//     id: int,
//     values: {
//         firstname: string,
//         lastname: string,
//         email: string,
//         password: long,
//         project_ids: [int]
//         field: string,
//         hours: string,
//         timestamp: string (account creation)
//         hasPayment: boolean,
//     }
// }
var projects = {}
// projects = {
//     id: int,
//     values: {
//         id: int,
//         client_id: int,
//         client_firstname: string,
//         client_lastname: string,
//         client_email: string
//         freelancer_id: int,
//         freelancer_firtname: string,
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



// /*fs.readFile(freelancersFile, 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         console.log("Read data file: " + obj);
//         if (obj) freelancers = obj;
//     }
// });*/
var read = (filePath) => {
    fs.readFile(filePath, 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            console.log("Read data file: " + obj);
            if (obj) return obj;
        }
    });
}
/*
var uploadFile = (filePath, bucketName) => {
    var params = {
            Bucket: bucketName,
            Body: fs.createReadStream(__dirname + "/" + filePath),
            Key: "folder/"+"_"+path.basename(filePath)
        }
    var backupparams = {
        Bucket: bucketName,
        Body: fs.createReadStream(__dirname + "/" + filePath),
        Key: "backup/" + Date.now() + "_" + path.basename(filePath)
    }
        s3.upload(params, function (err, data) {
            if (err) {
                console.log("S3 error: ", err);
            } else {
                console.log("Write success: Check S3");
                }
        })
        s3.upload(backupparams, function (err, data) {
            if (err) {
                console.log("S3 error: ", err);
            } else {
                console.log("Write backup success: Check S3");
                }
        })

}

var downloadFile = (filePath ,bucketName) => {
    var params = {
        Bucket: bucketName,
        Key: "folder/"+"_"+path.basename(filePath)
    }
    s3.getObject(params, (err, data) => {
        if (err) console.error(err);
        fs.writeFileSync(__dirname + "/" + filePath, data.Body.toString());
        console.log('Readd success: ' + filePath);
    })
}

var getFiles = () => {
    downloadFile("freelancers.json", bucket);
    downloadFile("clients.json", bucket);
    downloadFile("projects.json", bucket);
    fs.readFile("freelancers.json", 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            console.log("Read data file old-fashioned way: " + obj);
            if (obj) freelancers = obj;
        }
    });
    // reads file (.json) into variable
    fs.readFile("clients.json", 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            console.log("Read data file old-fashioned way: " + obj);
            if (obj) clients = obj;
        }
    });
    // reads file (.json) into variable
    fs.readFile("projects.json", 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            console.log("Read data file old-fashioned way: " + obj);
            if (obj) projects = obj;
        }
    });
}


getFiles();
*/
//uploadFile("freelancers.json", bucket);
//uploadFile("clients.json", bucket);
//uploadFile("projects.json", bucket);
/** Pulls data down from S3 into local files */
// downloadFile("freelancers.json", bucket);
// downloadFile("clients.json", bucket);
// downloadFile("projects.json", bucket);
// // freelancers = read("freelancers.json");
// // clients = read("clients.json");

// //projects = read("projects.json");

// // reads file (.json) into variable
// fs.readFile("freelancers.json", 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         console.log("Read data file old-fashioned way: " + obj);
//         if (obj) freelancers = obj;
//     }
// });
// // reads file (.json) into variable
// fs.readFile("clients.json", 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         console.log("Read data file old-fashioned way: " + obj);
//         if (obj) clients = obj;
//     }
// });
// // reads file (.json) into variable
// fs.readFile("projects.json", 'utf8', function readFileCallback(err, data) {
//     if (err) {
//         console.log(err);
//     } else {
//         obj = JSON.parse(data); //now it an object
//         console.log("Read data file old-fashioned way: " + obj);
//         if (obj) projects = obj;
//     }
// });


app.use(express.static('public'));

//////////////////////\\\\\\\\\\\\\\\\\\\\\\
//////////////// INDEX PAGE \\\\\\\\\\\\\\\\
//////////////////////\\\\\\\\\\\\\\\\\\\\\\
app.get('/', function (req, res) {
    //getFiles();
    res.sendFile(__dirname + "" + "index.html");
})

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
    //getFiles();
    // Prepare output in JSON format
    var p = '';
    // bcrypt.hash(req.body.password, 10, function(err, hash) {
    //     console.log(hash);
    //     p = hash;
    //     console.log(p);
    // });

    var time = new Date().getUTCMilliseconds(); // creates validation time for each user


    p = bcrypt.hashSync(req.body.password, 10);

    // get length and replace here (client_id = length + 1)
    // var client_id = parseInt(Object.keys(clients).length + 1);
    var client_id = 4;
    // insert {"id: "}
    // clients[client_id] = response;
    // console.log("num clients right now: " + clients_db.find().length);

    // insert new client
client.connect(function (err) {
    //console.log("in connect function");
    if (err) {
        console.log("error: " + err);
    } else {
        

        console.log("succesfully connected client");
        lwdb = client.db("lwdb");
        clients_db = lwdb.collection("clients");
        cid = (parseInt(clients_db.count()) || 0) + 1;
        console.log(cid);
        response = {
            id: cid,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: p,
            project_ids: matchEmails(req.body.email),
            timestamp: time,
            hasPayment: false
        };

        clients_db.insert(response, (err, result) => {
                if (err) { console.log(err); }
                else {
                    console.log("registered client");
                    console.log(cid);
                }
            }
        ) // end insert function

        req.session.user = cid;
        console.log()
        req.session.user_type = 'client';
    
        //TODO: AWS switchover (done)
    
        fs.writeFile('clients.json', JSON.stringify(clients), 'utf8', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        
        
        // uploadFile("clients.json", bucket);
        // console.log("Uploaded client file to S3");
    
        //take existing clients file and just upload (?)
    
        //console.log(response);
        res.redirect("/client/project/" + "dashboard.html");
    } // end else statement
}); // end client insert

    
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
    //getFiles();
    res.sendFile(__dirname + "/client/account/" + "login.html");
})
app.post('/client/account/login.html/post', urlencodedParser, function (req, res) {
    //getFiles();
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
    console.log('login user id ' + user_id);
    if (user_id == -1) {
        res.sendFile(__dirname + "/public/client/account/" + "login.html");
    } else {

        //if (req.body.password == clients[user_id]['password']) {
        if (bcrypt.compareSync(req.body.password, clients[user_id]['password'])) {

            // sets a cookie with the user's info
            req.session.user = user_id;
            req.session.user_type = 'client';
            clients[user_id]['project_ids'] = matchEmails(req.body.email);
            res.redirect('/client/project/dashboard.html');
        } else {
            res.sendFile(__dirname + "/public/client/account/" + "login.html");
        }
    }

    console.log(response);
    res.sendFile(__dirname + "/public/client/account/" + "login.html");
})

// if (clients[req.session.user]['timestamp'] == req.body.key) {
//let them through
//} else {
// don't let them in
//}
/* But this means that people can change user id to get different hash

OPTIONS:
1) add the account time to all forms and check that the project id has user id whose time = time
2) 
*/

////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\
/////////////// FREELANCER PAGES \\\\\\\\\\\\\\\
////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\

// account

app.get('/flogout', function (req, res) {
    req.session.destroy();
    res.redirect('/freelancer/account/login.html');
    //res.end(req.session.user);
})
app.get('/clogout', function (req, res) {
    req.session.destroy();
    res.redirect('/client/account/login.html');
    //res.end(req.session.user);
})

app.get('/freelancer/account/addinfo.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/account/" + "addinfo.html");
})
app.post('/freelancer/account/addinfo.html/post', urlencodedParser, function (req, res) {
    getFiles();
    // Prepare output in JSON format
    freelancers[req.session.user]['field'] = req.body.lineOfWork;
    freelancers[req.session.user]['hours'] = req.body.typeOfFreelancer;
    response = {
        typeOfFreelancer: req.body.typeOfFreelancer,
        lineOfWork: req.body.lineOfWork
    };
    //TODO: AWS switchover (done)
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    uploadFile("freelancers.json", bucket);
    console.log("Uploaded freelancers file to S3");
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
    getFiles();
    res.sendFile(__dirname + "/freelancer/account/" + "login.html");
})
app.post('/freelancer/account/login.html/post', urlencodedParser, function (req, res) {
    getFiles();
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

        if (bcrypt.compareSync(req.body.password, freelancers[user_id]['password'])) {
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
    getFiles();
    // Prepare output in JSON format
    // this is filled out
    var time = new Date().getUTCMilliseconds(); // creates validation time for each user
    p = bcrypt.hashSync(req.body.password, 10);

    response = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: p,
        project_ids: [],
        timestamp: time,
        hasPayment: false
    };
    var freelancer_id = parseInt(Object.keys(freelancers).length) + 1;
    freelancers[freelancer_id] = response;
    req.session.user = freelancer_id;
    req.session.user_type = 'freelancer';

    //TODO: AWS switchover (done)
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    uploadFile("freelancers.json", bucket);
    console.log("Uploaded freelancers file to S3");
    console.log(response);
    res.redirect("/freelancer/account/" + "addinfo.html");
})

// PROJECT
app.get('/freelancer/project/addclient.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "addclient.html");
})
app.post('/freelancer/project/addclient.html/post', urlencodedParser, function (req, res) {
    getFiles();
    // Prepare output in JSON format
    var proj_id = parseInt(Object.keys(projects).length + 1);

    // Upload contract
    /*
        1. Create project filename
        2. Upload file to AWS
        3. Store filename in JSON file
    */
    var amount = Math.floor(parseFloat(req.body.amount) * 100);
    response = {
        id: proj_id,
        client_id: -1,
        client_firstname: req.body.firstname,
        client_lastname: req.body.lastname,
        client_email: req.body.email,
        freelancer_id: req.session.user,
        freelancer_firstname: freelancers[req.session.user]['firstname'],
        freelancer_lastname: freelancers[req.session.user]['lastname'],
        name: req.body.projname,
        contract: req.body.contract,
        amount: amount,
        milestones: [],
    };
    projects[proj_id] = response;
    freelancers[req.session.user]['project_ids'].push(proj_id);
    req.session.project = proj_id;
    req.session.amount = amount;
    req.session.remaining_amount = amount;
    //TODO: AWS switchover (done)
    fs.writeFile('freelancers.json', JSON.stringify(freelancers), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    uploadFile("freelancers.json", bucket);
    console.log("Uploaded freelancers file to S3");
    //TODO: AWS switchover (done)
    fs.writeFile('projects.json', JSON.stringify(projects), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    uploadFile("projects.json", bucket);
    console.log("Uploaded projects file to S3");
    console.log(response);
    res.redirect("/freelancer/project/" + "addmilestones.html");
})

app.get('/freelancer/project/addmilestones.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "addmilestones.html");
})
app.post('/freelancer/project/addmilestones.html/post', urlencodedParser, function (req, res) {
    getFiles();
    // Prepare output in JSON format
    var amount;
    amount = req.body.fixedAmount;
    // if (req.body.unitOfMoney == 'percent') {
    //     amount = Math.ceil(parseFloat(req.body.amount) / 100 * projects[req.session.project]['amount']);
    // } else {
    //     amount = Math.floor(parseFloat(req.body.amount) * 100);
    // }
    response = {
        'date': req.body.date,
        'amount': amount,
        'description': req.body.desc,
        'feedback': '',
        'client_approved': false,
        'freelancer_approved': false,

    };
    // Check that we haven't gone over
    req.session.remaining_amount = req.session.remaining_amount - amount;
    console.log("project: " + req.session.project + " | response: " + JSON.stringify(response));
    projects[req.session.project]['milestones'].push(response);
    //TODO: AWS switchover (done)
    fs.writeFile('projects.json', JSON.stringify(projects), 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    uploadFile("projects.json", bucket);
    console.log("Uploaded projects file to S3");
    console.log(response);
    if (req.body.submit == 'Add More') {
        res.redirect("/freelancer/project/" + "addmilestones.html");
    } else {
        res.redirect("/freelancer/project/" + "dashboard.html");
    }

})

app.get('/freelancer/project/dashboard.html', function (req, res) {
    res.sendFile(__dirname + "/freelancer/project/" + "dashboard.html");
})
app.post('/freelancer/project/dashboard.html/post', urlencodedParser, function (req, res) {
    /** Should never be reached */


    // We should never be posting to dashboard. We post to /approve_method

    // Prepare output in JSON format
    // receives project_id, milestone_index

    // if (freelancers[req.session.user]['project_ids'].includes(req.body.project_id)) {
    //     projects[req.body.project_id]['milestones'][milestone_index]['freelancer_approved'] = true;
    //     console.log(response);
    // } else {
    //     // alert that you can't edit that project
    //     response = {};
    // }

    //TODO: fill this out
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
        '\ncurrent user type: ' + req.session.user_type +
        '\ncurrent project:  ' + req.session.project +
        '\nclients:     ' + JSON.stringify(clients) +
        '\nfreelancers: ' + JSON.stringify(freelancers) +
        '\nprojects:    ' + JSON.stringify(projects));
})

/*
client.connect(function (err) {
    //console.log("in connect function");
    if (err) {
        console.log("error: " + err);
    } else {
        

        console.log("succesfully connected client");
        lwdb = client.db("lwdb");
        clients_db = lwdb.collection("clients");
        cid = clients_db.find().length + 1;
        response = {
            id: cid,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: p,
            project_ids: matchEmails(req.body.email),
            timestamp: time,
            hasPayment: false
        };

        clients_db.insert(response, (err, result) => {
                if (err) { console.log(err); }
                else {
                    console.log("registered client");
                    console.log(cid);
                }
            }
        ) // end insert function

        res.redirect("/client/project/" + "dashboard.html");

    } // end else statement
}); // end client insert
*/

app.get('/user_name', function (req, res) {
    if (req.session.user) {
        if (req.session.user == -1) {
            res.end("");
        } else {
            if (req.session.user_type == "freelancer") {
                client.connect(function (err) {
                    lwdb = client.db("lwdb");
                    freelancers_db = lwdb.collection("freelancers");
                    //console.log("in connect function");
                    if (err) {
                        console.log("error: " + err);
                    } else {
                        freelancers_db.find(({id:req.session.user}, {firstname:1}), (err, result) => {
                                if (err) { console.log(err); }
                                else {
                                    console.log("result = "+ result);
                                    res.end(toString(result[0]));
                                }
                            }
                        ) // end insert function
                    } // end else statement
                }); // end client insert
                // res.end(freelancers[req.session.user]['firstname']);
            }
            else {
                client.connect(function (err) {
                    lwdb = client.db("lwdb");
                    clients_db = lwdb.collection("clients");
                    //console.log("in connect function");
                    if (err) {
                        console.log("error: " + err);
                    } else {
                        console.log("looking for someone with user id " + req.session.user);
                        var r = clients_db.find({id:req.session.user},{firstname:1});
                        console.log("found " + r.nextObject());
                        res.end(toString(r.firstname));
                        //) // end insert function
                    } // end else statement
                }); // end client insert
            }
        }
    } else {
        res.end("");
    }


})

app.get('/logged_in', function (req, res) {
    if (!req.session.user || req.session.user == -1) {
        console.log("user (not logged in) is " + req.session.user);
        res.end("-1");
    } else {
        console.log("user is " + req.session.user);
        res.end("1")
    }
})

app.get('/projects', function (req, res) {
    var user_projects = [];
    freelancers[req.session.user]['project_ids'].forEach(function (i) {
        user_projects.push(projects[i]);
    })
    res.end(JSON.stringify(user_projects));
})

app.get('/remainingamt', function (req, res) {
    if (req.session.remaining_amount) {
        res.end(toString(req.session.remaining_amount));
    } else {
        res.end("");
    }
})

app.get('/projectamt', function (req, res) {
    if (req.session.product) {
        if (req.session.amount) {
            res.end(toString(req.session.amount));
        } else {
            res.end("");
        }
    } else {
        res.end("");
    }
})

app.get('/client_projects', function (req, res) {
    var user_projects = [];
    clients[req.session.user]['project_ids'].forEach(function (i) {
        user_projects.push(projects[i]);
    })
    res.end(JSON.stringify(user_projects));
})

app.post('/approve_milestone', urlencodedParser, function (req, res) {
    var submitted = req.body.submitbtn;
    var project_id = req.body.project_id;
    var milestone_index = req.body.milestone_index;
    //if (freelancers[req.session.user]['project_ids'].includes(project_id)) {
    if (true) {
        console.log(project_id + ' ' + milestone_index);
        projects[project_id]['milestones'][milestone_index]['freelancer_approved'] = true;
        res.redirect("/freelancer/project/" + "dashboard.html");
    } else {
        console.log("tried to edit milestone not assigned to user");
    }
})

app.post('/client_approve_milestone', urlencodedParser, function (req, res) {
    var submitted = req.body.submitbtn;
    var project_id = req.body.project_id;
    var milestone_index = req.body.milestone_index;
    console.log(project_id + ' ' + milestone_index);
    projects[project_id]['milestones'][milestone_index]['client_approved'] = true;
    res.redirect("/client/project/" + "dashboard.html");
})

app.post('/token', function (req, res) {
    console.log('body is ' + req.body);
    token = req.body.token;
    console.log('token is: ' + JSON.stringify(token));
})

app.get('/project', function (req, res) {
    var proj = "";
    console.log(req.session.project);
    if (req.session.project) {
        proj = JSON.stringify(req.session.project);
        console.log("proj = ");
        console.log(proj);
    }
    res.end(proj);
})

app.get('/create_account', function (req, res) {
    if (req.session.user_type == 'client') {
        clients[req.session.user]['account'] = req.query.code;
    } else {
        freelancers[req.session.user]['account'] = req.query.code;
    }
    res.end(req.query.code);
})

app.get('/fname', function (req, res) {
    res.end(projects[req.session.project])
})

function matchEmails(client_email) {
    var project_ids = [];
    if (projects != {}) {
        Object.keys(projects).forEach(function (proj) {
            if (client_email == projects[proj]['client_email']) {
                project_ids.push(projects[proj]['id']);
            }
        })
    }
    return project_ids;
}

var server = app.listen(process.env.PORT || 8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
