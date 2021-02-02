require('dotenv').config();
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const { response } = require('express');
const uri = process.env.URL;
const DATABASE_NAME = process.env.DB_NAME;

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var collection;

app.post("/push", (request, response) => {
    console.log(request.body.username);
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/get-all", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.put("/edit-name/", (request, response) => {
    collection.update({ "username": request.body.username }, {
        $set: {
          "fullName": request.body.fullName,
        }
      });
    response.status(200).send('Update successful');
});

app.listen(4000, () => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        collection = client.db(DATABASE_NAME).collection("users");
        // perform actions on the collection object
        console.log('Connected to ' + DATABASE_NAME);
    });
});