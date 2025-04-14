const express = require('express')
const collection = require("./mongo")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//Login page
app.get("/", cors(), (req, res) => {

})

//Data from login
app.post("/", async(req, res) => {
    const{username,password} = req.body
    try {
        //Verify login credentials in database
        const verify=await collection.findOne({username:username})
        if(verify) {
            res.json("Successfully logged in")
        }
        else {
            res.json("Account does not exist")
        }
    }
    catch(err){
        res.json("Account does not exist");
    }
})

//Data from Signup
app.post("/Signup", async(req, res) => {
    const{email,username,password} = req.body
    const data={
        email:email,
        password:password,
        username:username
    }
    try {
        //Verify login credentials in database
        const verifyEmail=await collection.findOne({email:email})
        if(verifyEmail) {
            res.json("Email already used for an existing account")
        }
        else {
            const checkUsername = await collection.findOne({username:username})
            if(checkUsername) {
                res.json("Username already exists")
            }
            else {
                res.json("Account does not exist")
                await collection.insertMany({data})
            }
        }
    }
    catch(err){
        res.json("Error creating account");
    }
})

//Listening for input
app.listen(8080, () => {
    console.log("Listening on port 8080");
})