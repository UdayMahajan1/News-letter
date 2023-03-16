const express = require('express') ;

const app = express() ;

var {urlencoded} = require('body-parser') ;

// the https module is required to send requests to the api 

const https = require('https') ;

const { response } = require('express');

app.use(urlencoded({extended:true})) ;

app.use(express.static(__dirname+`/public`)) ;

app.get('/', (req,res)=>
{
    res.sendFile(__dirname+`/public/signup.html`) ;
})

app.post('/', (req,res)=>
{
    const fName = req.body.fName ;
    const lName = req.body.lName ;
    const email = req.body.email ;
    
    const url = 'https://us21.api.mailchimp.com/3.0/lists/1096491142/members?skip_merge_validation=<true' ;

// so in this particular project I needed to use the post request to retrieve the user 
// entered data and send the data to the mailchimp server according to their 
// specifications for which the http module was used. The data constant below is the 
// format specified by the mailchimp api

    const data = {
        email_address: email, 
        status:"subscribed",
        merge_fields: {
            FNAME: fName,
            LNAME: lName 
        }
    }

    // stringfy converts the json from json format to string format i.e. squishes it

    const jsonData = JSON.stringify(data) ;

// this options constant was the most crucial part...this js object specifies the 
// nature of the request and includes an important part that is authentication which is 
// needed everytime we work with an api  

    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer '+ 'a15e6685dced5def618ee780f1426ffe8-us21'
        }
    }

// below is the main part where things are set into motion...we send the request to the 
// api using https.request and store the result of the request sent to us by the api in 
// the request constant and depending upon the statusCode send the failure or success 
// pages

    const request = https.request(url, options, (response)=>
    {
        response.on('data', (d)=>
        {
            console.log(JSON.parse(d)) ;
        })

        if(response.statusCode === 200) {
            res.sendFile(__dirname+`/public/success.html`) ;
        } else {
            res.sendFile(__dirname+`/public/failure.html`) ;
        }
    })

    request.on('error', (e) =>
    {
        console.error(e);
    });

    request.write(jsonData) ;

// to terminate the request 

    request.end() ;
})

app.post('/failure', (req,res)=>
{
    res.redirect('/') ;
})

app.listen(3000, (req,res)=>
{
    console.log("Server is running on port 3000.") ;
})
