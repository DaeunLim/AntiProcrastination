//index.js
import express from 'express';
import mongoose from "mongoose";
import { CalendarModel } from '../models/calendarSchema.js';
import { UserModel } from '../models/userSchema.js';
import { DateModel } from '../models/dateSchema.js';
import connectMongoDB from '../libs/mongodb.js';
import cors from 'cors';
import bcrypt from "bcryptjs";
import session from 'express-session';
const MongoDBStore = require('connect-mongodb-session')(session);


require('dotenv').config() // get .env variables

// HI! This is the server! Here is how to start it up:
// run "npm run server"
//  -- this should build the server bundle and then run it (it takes a sec)
//  -- if you can come up with a better way to do this, be my guest
// then run "npm run start"
//  -- this should run the app

// I will run down how to set up the .env
// 1. make a .env file
// 2. add this mongodb thing under MONGODB_URI=
// -- mongodb+srv://<USERNAME>>:<PASSWORD>>@cluster0.nplvmb2.mongodb.net/timely?retryWrites=true&w=majority&appName=Cluster0
// 3. type this command and add the result to the .env under JWT_SECRET=
// -- node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
// 4. add JWT_EXPIRES_IN=30d

// IF PROBLEMS ARISE
// Make sure express, bcryptjs (NOT BCRYPT), mongoose, jwt, and cors are all installed
// Shoot me a message because I am pretty sure I forgot stuff


const app = express(); // creates express app
app.set('trust proxy', 1);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
store.on('error', function(error) {
  console.log(error);
});
app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: store,
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: true,
  }
}));

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "PUT", "GET", "DELETE"],
  credentials: true,
})); // allows requests only from same domain

app.use(express.json()); // reads json

// WHAT NEEDS TO HAPPEN UPON LOAD
// : user creates account
// : user then logs into account
// : verify and then create token
//    | token contains user info besides password and email
//    | need user ID or username for setting calendar info and retrieving calendars of user
// : retrieve calendars and then render them
//    | store within array and prevent continuous fetch for them
//    | any changes need to be immediately uploaded to database
// WHAT NEEDS TO HAPPEN UPON ADD
// : user creates calendar
// : calendar is added to:
//    | array on client
//    | to calendar database
//    | to user via acquiring id of calendar


const isAuthenticated = (req, res, next) => {
  console.log(req.session);
  console.log(req.session.user);
  if (!req.session.user) { // if not signed in
    return res.status(401).json({ error: 'Unauthorized' });
  } else {
    next(); // next step
  }
};
// API section
// : TODO
//    | add /api/dates methods
// /api/user/
// : TODO
//    | follow diagram on Miro for attributes and other stuff
//    | See AUTH STUFF for basic authentication done
//    | check this link: https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d
// : POST user
app.post('/api/user/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Connect to MongoDB
    await connectMongoDB();

    // Check if the email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email is already in use!" });
    }

    // Check if username already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username is already in use!" });
    }

    // Create the new user
    const newUser = { username, email, password: hashedPassword };
    await UserModel.create(newUser);

    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json(
      { message: "An error occurred while creating the user. Please try again later." },
    );
  }
})
// /api/calendar/
// : implementation notes
//    | do we really need subscribers upon creation? do we need dates upon creation?
//    | do we really need owner for calendar? should we allow owner transfer?
// : GET calendar
//    | implementation notes
//         > need one for specific id
//             - call this several times to acquire each calendar that the user is subscribed to or owns
//             - other solution would be to call find function to find each calendar within calendar category
// : POST calendar
app.post('/api/calendar/add', isAuthenticated, async (req, res) => {
  try {
    const { owner, subscribers, dates } = req.body; // get calendar info

    const _id = new mongoose.Types.ObjectId(); // generate id for adding to user purposes and in case of failure of creation

    await connectMongoDB(); // connect to database
    
    await UserModel.updateOne({ _id: req.session.user }, { $addToSet: { calendars: _id.toString() }}) // update user with new calendar

    await CalendarModel.create({ _id, owner: req.session.user, subscribers, dates }); // add new calendar

    return res.status(201).json({ message: "Calendar added successfully", _id: _id }); // send back message and calendar id
  } catch (error) {
    console.error("Error adding calendar:", error);
    res.status(500).json({ error: "Failed to add calendar" });
  }
})
// : PUT calendar
app.put('/api/calendar/update/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id
    const { owner, subscribers, dates } = req.body; // get calendar info

    await connectMongoDB(); // connect to database

    await CalendarModel.findByIdAndUpdate(id, { owner, subscribers, dates }); // update calendar

    res.status(200).json({ message: "Calendar updated successfully" }); // send back message
  } catch (error) {
    console.error("Error updating calendar:", error);
    res.status(500).json({ error: "Failed to update calendar" });
  }
})
// : DELETE calendar
app.delete('/api/calendar/delete/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id

    if (!mongoose.Types.ObjectId.isValid(id)) { // if valid id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database
    const deletedCalendar = await CalendarModel.findByIdAndDelete(id); // check if calendar

    if (!deletedCalendar) {
      return res.status(404).json({ message: "Calendar not found" }); // if no calendar
    }

    res.status(200).json({ message: "Calendar deleted" }); // send back message
  } catch (error) {
    console.error("Error deleting calendar:", error);
    res.status(500).json({ error: "Failed to delete calendar" });
  }
})

// API port
app.listen(8080, () => {
  console.log('server listening on port 8080')
})


// AUTH STUFF
// credit: https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d
// method determines if token sent is even possible
// credit: https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d
// Protected route to get user details and verify token
// : basically, this should only be able to be used if user is logged in, and then checking if their session is valid
// : if their session isn't, then stop them
// : GET verify
app.get('/api/verify', isAuthenticated, async (req, res) => {
  try {
    console.log("verify")
    console.log(req.headers.cookie)
    console.log(req.session)
    console.log(req.session.user)
    const _id = req.session.user; // decoded user info

    await connectMongoDB();
    
    const user = await UserModel.findById(_id); // get user info

    if (!user) { // if no user
      req.session = null;
      return res.status(404).json({ error: 'User not found' });
    }
    // send back user info
    res.status(200).json({ _id: user._id, username: user.username, email: user.email, calendars: user.calendars });
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// : POST login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body; // get form submitted credentials

    if (!username || !password) return null; // if one is empty, send it back NOTE: might need to make it send back response and not null

    await connectMongoDB(); // connect to database

    const user = await UserModel.findOne({ username }); // check to see if there is a user

    if (user) {
      const isMatch = await bcrypt.compare( // compare password to hashed password
        password,
        user.password,
      );

      if (isMatch) { //create token
        req.session.user = user._id.toString();
        res.send(JSON.stringify(req.session));
        //res.status(200).json({ message: "Login successful" }); // send back session
      } else {
        return res.status(401).json({ error: "Username or Password is not correct" });
      }
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: 'Failed to login' });
  }
});




