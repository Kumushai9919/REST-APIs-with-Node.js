const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { json } = require("body-parser");


const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    
    res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.secondName;
    const email = req.body.email;

    //data to send to server, our data is sending by body parameters using "members"
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    // in order to convert javascript -> json format, data-> jsonData 
    const jsonData = JSON.stringify(data);

    //making request with https modules, first we pass our url, then options, finally callback func which is going to give us a response from the MailChimp 
    const url = "https://us18.api.mailchimp.com/3.0/lists/d3bda3a5b3"
    const options = {
        method: "POST",
        auth: "kumush1:ccdc7f393230a7c6a1e8eea7bdaaf37f-us18"
    }
    const request =  https.request(url, options, function(response){
        
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        } 

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");  
})

 
//API key'
// ccdc7f393230a7c6a1e8eea7bdaaf37f-us18

// List ID
// d3bda3a5b3

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});

