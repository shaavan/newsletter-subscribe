// acquire the required modules to do operations

// Express to use express.js framework
const express = require("express");

// request to be allow to right code for user to make post request.
const request = require("request");

// https to parse the data posted by user.
const https = require("https");

// Using app as the express object to do all operations
const app = express();

// To use static pages in html sendFile, we need to use a express method.
app.use(express.static("public"));

// Use urlenconded to capture form data sent by user.
app.use(express.urlencoded({ extended: true }));

// app.get method allows writing code when the user makes the "GET" request
// to get the data on a particular path on our site.
app.get("/", function (req, res) {

    // res.sendFile, sends a file when user makes the GET request
    res.sendFile(__dirname + "/signup.html")
});

// app.post method allows writing code for when the user makes the "POST" request
// on a particular path on our site to post some kind of data which we specified
// on our HTML site.
app.post("/", function (req, res) {

    // res.send(string) prints the string when user makes the post request here.

    // Because we are using (app.use), express.urlencoded, we are able to capture
    // data sent by user on our HTML form in a JSON like syntax.
    /*  req = {
            body: {
                fName: "First Name",
                lName: "Last Name",
                email: "Email Address"
            }
        }
    */
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // We create a data object to share the information the user shared with us,
    // to subscribe them on our mailing list. The format of the data comes from
    // the mailchimp documentation. It provides us the info on how to construct
    // the data that needs to be sent to mailchimp api to subscribe them to our
    // mailing list.
    // doc_link: https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/

    const data = {
        members: [{
            "email_address": email,
            "status": "subscribed",
            merge_fields: {
                "FNAME": firstName,
                "LNAME": lastName
            }
        }]
    }

    // The data is then stringified because the mailchimp api accepts data in this format.
    const jsonData = JSON.stringify(data);

    // url for https request sent to mailchimp server, say for subscribing user.
    const url = "https://us8.api.mailchimp.com/3.0/lists/ef6eab7a3a";

    // options corresponds to https.request(url, <options>, callback).
    // options is a js object with default values for all its properties,
    // which we can override by creating our own options object and passing
    // it in https.request().
    const options = {
        // Since the default value of "method" is get and here we need the POST method
        // hence we override the method property.
        method: "POST",
        // Since the mailchimp api requires us to autherise that we are the person who
        // can edit this mailing list, we have to update the auth parameter as well in
        // options which stands for authorisation.
        // The format of auth is "anyString":authKey. The "anyString" can literally be
        // any string.
        auth: "anyString:50a07a6c51b945f6751f610347130817-us8"
    }

    // Finally we create a request const to create our https.request(), with the url,
    // options, and callback function.
    // The callback function has only one variable response, which is the response which
    // we receive when we send the mailchimp server our request.
    const request = https.request(url, options, function (response) {
        // response.on("data", function(data)) will activate once we receive some "data"
        // in the response. The data will contain bunch of information about status code
        // and other details, which can further use and work upon in the callback function.

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {

            // Print the parsed version of received data from the response.
            console.log(JSON.parse(data));
        });
    });

    // Finally we use our https request variable that we created to write our user's data in it.
    request.write(jsonData);
    // And we use request.end() to let the api know that we are done writing the info, and the data
    // can finally be POSTed to api server.
    request.end();

});

app.post("/failure", function(req, res) {
    // res.redirect(path), triggers the app.get(path, callback), and do the operations under that command.
    res.redirect("/");
});




var port = process.env.PORT || 3000;

app.listen(Number(port), "0.0.0.0", function () {
    console.log(`listening on port: ${port}`);
})


// Mailling list key
// 50a07a6c51b945f6751f610347130817-us8
// Audience ID
// ef6eab7a3a
