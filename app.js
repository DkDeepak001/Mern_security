//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const mongoose = require('mongoose');
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const saltRounds = 10;



const app = express();

//set view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));


//initalizing body parser
app.use(bodyParser.urlencoded({extended: true}));

//connect mongoose 
mongoose.connect("mongodb://localhost:27017/Auth");


//creating MongoDB scehema
const loginSchema = new mongoose.Schema({
    username : String,
    password : String
})




const User = new mongoose.model("UserData",loginSchema);



//initalizing route for homepage
app.route("/")
    .get((req,res)=> {
        res.render("home");
    })


//initalizing route for register
app.route("/register")
    .get((req,res) => {
        res.render("register");
    })
    .post((req,res) => {

        const email = (req.body.username);
        const password = (req.body.password);

        bcrypt.hash(password, saltRounds, function(err, hash) {
            const newUser = new User({
                username: email,
                password: hash
            })
    
            newUser.save((err)=>{
                if(!err){
                    res.redirect("/");
                }else{
                    res.write(err);
                }
            }) 
        });

       

    })


//initalizing route for login
app.route("/login")
    .get((req,res) => {
        res.render("login");
    })
    .post((req,res) => {
        const email = (req.body.username);
        const password = (req.body.password);

        
        User.findOne({username:email},(err,user) => {
            if(user){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(user.username === email && result === true){
                        res.render("secrets",{username : user.username});
                    }else{
                        console.log("username & password does not match");
                    }
                   
                });
               
            }else{
                console.log("user not found");
            }
        })
    })


//initalizing route for secrets
app.route("/secrets")
    .get((req,res) => {
        res.render("secrets");
    })




//app listing port 
app.listen('3000',()=>{
    console.log("server listing on port 3000");
})