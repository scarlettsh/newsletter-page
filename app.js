const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("node:https");
const { parse } = require("node:path");
const { json } = require("body-parser");

const app = express();

app.get("/signup.html", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

app.post("/signup.html", (req, res) => {
  console.log(req.body);
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  console.log(firstName + lastName + email);

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsondata = JSON.stringify(data);

  // var apikey = "68e07b689f8144fdc99987c5c5398ca4-us17";
  var listid = "f95ebea4ab";

  var url = "https://us17.api.mailchimp.com/3.0/" + "lists/" + listid;

  var options = {
    method: "POST",
    auth: "sijia:36157d0c4022ec37110eeb071a5559eb-us176",
  };

  var request = https.request(url, options, (respond) => {
    respond.on("data", (data) => {
      const feedback = JSON.parse(data);
      console.log(feedback);

      if (respond.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  //try another method in mailchimp api to send the body parameter to the mailchimp server.
  request.write(jsondata);
  request.end();
});

  app.post("/failure", (req, res) => {
    res.redirect("/signup.html");
  })

//list id:f95ebea4ab
// root url:https://<dc>.api.mailchimp.com/3.0/
//api key: 68e07b689f8144fdc99987c5c5398ca4-us17

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
