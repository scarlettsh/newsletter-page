const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("node:https");
require("dotenv").config();

const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});


app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));

app.post("/", (req, res) => {
  // console.log(req.body);
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  // console.log(firstName + lastName + email);

  let data = {
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

  let jsondata = JSON.stringify(data);

  let listid = process.env.MailchimpIdList;

  let url = "https://us17.api.mailchimp.com/3.0/" + "lists/" + listid;

  let options = {
    method: "POST",
    auth: "sijia:" + process.env.MailchimpApiKey
  };

  let request = https.request(url, options, (respond) => {
    respond.on("data", (data) => {
      const feedback = JSON.parse(data);
      // console.log(feedback);

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
  res.redirect("/");
});

// root url:https://<dc>.api.mailchimp.com/3.0/

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});
