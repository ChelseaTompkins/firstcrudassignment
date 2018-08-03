const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Create route for creating new users
app.post("/create/:id/:name/:age/:state", function(req, res){
  let userInfo = retrieveUserData();

  let newUser = {
    "id": req.params.id,
    "name": req.params.name,
    "age": req.params.age,
    "state": req.params.state
  }

  userInfo.push(newUser);
  fs.writeFileSync('./storage.json', JSON.stringify(userInfo));
  res.json(newUser);
});

//Get route for getting all users
app.get("/users", function(req, res){
  res.json(retrieveUserData());
});

//Get route for getting a user by name
app.get("/users/:name", function(req, res){
  let userInfo = retrieveUserData();
  for(let i=0; i<userInfo.length; i++){
    let user = userInfo[i];
    if(user.name === req.params.name){
      res.json(user);
      return;
    }
  }
  res.sendStatus(400);
});

//Update route for updating a user by name
app.put("/users/:name", function(req, res){
  let userInfo = retrieveUserData();

  let updatedUser = {
    "id": req.body.id,
    "name": req.body.name,
    "age": req.body.age,
    "state": req.body.state
  }

  for(let i=0; i<userInfo.length; i++){
    let user = userInfo[i];

    if(user.name === req.params.name){
      userInfo[userInfo.indexOf(user)] = updatedUser;
      fs.writeFileSync('./storage.json', JSON.stringify(userInfo));
      res.json(userInfo);
      return;
    }
  }
  res.sendStatus(400);
});

// Delete route for deleting a user by name
app.delete("/delete/users/:id", function(req, res){
  let index = req.params.id;
  let userInfo = retrieveUserData();
  for(let i=0; i<userInfo.length; i++){
    let user = userInfo[i];

    if(user.id === index){
      userInfo.splice(i, 1);
      // let filteredInfo = userInfo.filter((item) => {
      //   return item.id !== index
      // })
      fs.writeFileSync('./storage.json', JSON.stringify(userInfo));
      res.json(userInfo);
      return;
    }
  }
  res.sendStatus(400);
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});


function retrieveUserData(){
  let rawData = fs.readFileSync("./storage.json", "utf8");
  let jsData = JSON.parse(rawData);
  return jsData;
}
