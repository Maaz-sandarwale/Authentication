require("dotenv").config();
const express= require('express')
const app=express();
const bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({"extended":"true"}));
app.use(express.static("styles"));
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema =new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const user=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.sendFile(__dirname+"/home.html")
})


app.get("/register.html",function(req,res){
    res.sendFile(__dirname+"/register.html")
})

app.post("/register",function(req,res){
    const users=new user({
        email:req.body.username,
        password:req.body.password
    });
    users.save(function(err){
        if(err){
            console.log("Error while saving")
        }else{
            res.sendFile(__dirname+"/secrets.html");
        }
    })
})

app.get("/login.html",function(req,res){
    res.sendFile(__dirname+"/login.html")
})

app.post("/login",function(req,res){
     const username=req.body.username;
     const password=req.body.password;
     user.findOne({email:username},function(err,foundUser){
         if(err){
             console.log(err);
         }else{
             if(foundUser.password===password){
                 res.sendFile(__dirname+"/secrets.html")
             }
         }
     })
})

app.listen(3000,function(){
    console.log("Server is up and running")
})