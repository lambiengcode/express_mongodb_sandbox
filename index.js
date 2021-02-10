require("dotenv").config();
const Express = require("express");
const BodyParser = require("body-parser");
const app = Express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.URL;
const DATABASE_NAME = process.env.DB_NAME;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var collection;
var count = 0;

app.post("/push", (request, response) => {
  console.log(request.body.username);
  collection.insert(request.body, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result.result);
  });
});

app.get("/get-all", (request, response) => {
  collection.find({}).toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

app.put("/edit-name/", (request, response) => {
  collection.update(
    { username: request.body.username },
    {
      $set: {
        fullName: request.body.fullName,
      },
    }
  );
  response.status(200).send("Update successful");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  count++;
  var username = `User${count}: `;
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log(msg);
    io.emit("chat message", username + msg);
  });
});

app.listen(4000, () => {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    if(err) {
      return;
    }
    collection = client.db(DATABASE_NAME).collection("users");
    // perform actions on the collection object
    console.log("Connected to " + DATABASE_NAME);
  });
});
