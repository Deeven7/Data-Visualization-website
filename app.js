const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const Pusher = require("pusher");
const mongoose = require("mongoose");


const app = express();



// Setting up public folder

app.use(express.static(path.join(__dirname, 'public')));

// Setting up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Enabling cross-origin resource sharing (CORS)

app.use(cors());

// Mongo DB Schema

const Schema = mongoose.Schema;

const PollSchema = new Schema({
   pets: {
      type: String,
      required: true
   },
   points: {
       type: String,
       required: true
   }  
});

const Poll = mongoose.model('Poll', PollSchema); 

mongoose.Promise = global.Promise;

//Connecting to mongoDB atlas

mongoose.connect('mongodb+srv://Admin-Deeven:Test123@cluster0-rpbk3.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
.then(() => console.log("Mongo DB Atlas is Connected"))
.catch(err => console.log(err));

// Intializing the Pusher 

var petpusher = new Pusher({
    appId: '855774',
    key: '735625af503737a04182',
    secret: '575961ecd4c005b3052f',
    cluster: 'us2',
    useTLS: true
});


// Get method

app.get("/poll", function(req, res){
    Poll.find().then(votes => res.json({
        success: true,
        votes: votes
    }));
});

// Post method

app.post("/poll", function(req, res){
    
    const newVote = {
        pets: req.body.pets,
        points: 1
    }
    // triggering the pusher
    new Poll(newVote).save().then(vote =>{
        petpusher.trigger('pet-poll', 'pet-vote', {
            points: parseInt(vote.points),
            pets: vote.pets
        });
    
        return res.json({success: true, message: "You have successfully submitted your vote"});  
    });
});


// Server running on port 3000

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});

