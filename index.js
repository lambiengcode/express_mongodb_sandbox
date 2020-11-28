require('dotenv').config();
const Express = require("express");
const BodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.URL;
const DATABASE_NAME = "storage_my_file";

var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.post("/push", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/getall", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/find/:id", (request, response) => {
    collection.findOne({ "id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.filePath);
    });
});

app.listen(3000, () => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        collection = client.db(DATABASE_NAME).collection("files");
        // perform actions on the collection object
        console.log('Connected to ' + DATABASE_NAME);
    });
});