//==========DEPENDENCIES==========
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 5000, MONGODB_URL } = process.env;
//import express
const express = require("express");
//create application object
const app = express();
//import mongoose
const mongoose = require("mongoose");
//import cors and morgan
const cors = require("cors");
const morgan = require("morgan");

//==========Database Connection===========
//Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

//connection Events = placing event listeners on specific events
mongoose.connection
.on("open", () => console.log("You are connected to mongoose"))
.on("close", () => console.log("You are disconnected from mongoose"))
.on("error", (error) => console.log(error))

//==========Models==========
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model("People", PeopleSchema)

//==========Middleware==========
//sits in the middle of that request and response
app.use(cors()); // to prevent cors errors, open  access to all origins
app.use(morgan("dev")); //logging -- level of logging we want 
app.use(express.json()); //parse json bodies

//==========Routes============

// create a root route
app.get("/", (req, res) => {
    res.send("hello SEI");
});

//People index route
//it awaits untill the code runs
app.get("/people", async (req, res) => { 
    try {
        //send all people -- array of people in js onjects in the database --awaiting the reponse for thise
        res.json(await People.find({}));
    } catch (error) {
        //send error -- 
        res.status(400).json(error)
    }
})

//People Delete Route
app.delete("/people/:id", async (req, res) => {
    try {
        //send all people
        res.json(await People.findByIdAndRemove(req.params.id));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
})

//people Update Route
app.put("/people/:id", async (req, res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, { new: true }));
    } catch (error) {
        res.status(400).json(error);
    }
})

//People Create Route
app.post("/people", async (req, res) => {
    try {
        // send all people
        res.json(await People.create(req.body));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});

//Listener
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))