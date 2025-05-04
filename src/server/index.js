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
import connectMongoDBSession from 'connect-mongodb-session';
import { InvitationModel } from '../models/invitationSchema.js';


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
// 3. type this command and add the result to the .env under SESSION_SECRET=
// -- node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// IF PROBLEMS ARISE
// Make sure express, bcryptjs (NOT BCRYPT), mongoose, express-session, connect-mongodb-session, and cors are all installed
// Shoot me a message because I am pretty sure I forgot stuff


const app = express(); // creates express app
const MongoDBStore = connectMongoDBSession(session); // hookup MongoDB to Express
if (process.env.NODE_ENV === "production") app.set('trust proxy', 1); // trust first proxy when deployed
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
}); // create session in MongoDB
store.on('error', function (error) {
  console.log(error);
}); // when error occurs
app.use(session({
  name: 'session',
  secret: process.env.SESSION_SECRET, // sign string
  saveUninitialized: false, // do not save session until modified
  resave: false, // do not save to store if no changes to request
  store: store, // where to save session
  cookie: {
    httpOnly: true, // cookie can only be accessed through HTTP on this server
    secure: (process.env.NODE_ENV === "production"), // HTTP in dev, HTTPS otherwise
    sameSite: true, // cookie applicable only to website
  }
})); // creates session

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
//    | session contains user id (NOT USERNAME)
//    | need user ID for setting calendar info and retrieving calendars of user
//    | use /api/user/verify to acquire ID from session
//    | THIS MIGHT NEED TO CHANGE TO FIX SECURITY ISSUES
// : retrieve calendars and then render them
//    | store within array and prevent continuous fetch for them
//    | any changes need to be immediately uploaded to database
// WHAT NEEDS TO HAPPEN UPON ADD
// : user creates calendar
// : calendar is added to:
//    | array on client
//    | to calendar database
//    | to user via acquiring id of calendar

// QUESTION: do we want to call this every time we receive a request?
// if there is a session with user info, go ahead
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) { // if not signed in
    return res.status(401).json({ error: 'Unauthorized' });
  } else {
    next(); // next step
  }
};
// API section
// /api/user/
// : TODO
//    | follow diagram on Miro for attributes and other stuff
//    | See AUTH STUFF for basic authentication done
// : POST signup
app.post('/api/user/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body; // get signup info

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

    const _id = new mongoose.Types.ObjectId(); // generate id for adding to user purposes and in case of failure of creation

    // Create the new user
    const newUser = { username, email, password: hashedPassword, calendars: [_id] };
    const user = await UserModel.create(newUser);
    await CalendarModel.create({ _id, name: "Calendar", owner: user._id }); // add new calendar

    return res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json(
      { message: "An error occurred while creating the user. Please try again later." },
    );
  }
});
// AUTH STUFF
// credit: https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d
// method determines if token sent is even possible
// credit: https://medium.com/@ravipatel.it/building-a-secure-user-registration-and-login-api-with-express-js-mongodb-and-jwt-10b6f8f3741d
// Protected route to get user details and verify token
// : basically, this should only be able to be used if user is logged in, and then checking if their session is valid
// : if their session isn't, then stop them
// : GET verify
//    | this should be called to acquire user info on login CLIENT SIDE, especially to get calendar info of user
app.get('/api/user/verify', isAuthenticated, async (req, res) => {
  try {
    const _id = req.session.user; // decoded user info

    await connectMongoDB();

    const user = await UserModel.findById(_id); // get user info

    if (!user) { // if no user
      req.session = null;
      return res.status(404).json({ error: 'User not found' });
    }
    // send back user info
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      calendars: user.calendars,
      invitations: user.invitations,
      tasks_completed: user.tasks_completed,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// : POST login
app.post('/api/user/login', async (req, res) => {
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

      if (isMatch) { //create session
        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate((err) => {
          if (err) next(err);


          req.session.user = user._id.toString();

          // save the session before redirection to ensure page
          // load does not happen before session is saved
          req.session.save((err) => {
            if (err) return next(err)
          }); // save
          return res.status(200).json({ message: "Login successful",
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              calendars: user.calendars,
              invitations: user.invitations,
              tasks_completed: user.tasks_completed,
            } }); // send back user and session
        }); // regenerate session
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
// : GET logout
//    | Taken from express-session; might need to update
app.get('/api/user/logout', isAuthenticated, (req, res) => {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null
  req.session.save((err) => {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate((err) => {
      if (err) next(err)
    });
  });
});
// /api/calendar/
// : usage notes
//    | verification/authorization of the user should be done client-side using /api/user/verify to get user info
//    | can change to allow it here, but not sure how effective or exact idea
// : implementation notes
//    | do we really need subscribers upon creation? do we need dates upon creation?
//    | do we really need owner for calendar? should we allow owner transfer?
// : GET many
app.get('/api/calendar/', async (req, res) => {
  try {
    await connectMongoDB(); // connect to database

    const { calendars: calendarIDs } = await UserModel.findById(req.session.user); // not sure how to prevent second request

    const calendars = await CalendarModel.find({ _id: { $in: calendarIDs } }); // find calendars

    if (!calendars) {
      return res.status(404).json({ message: "Calendars not found" });
    }

    return res.status(200).json(calendars); // send back calendars
  } catch (error) {
    console.error("Error finding calendars:", error);
    return res.status(500).json({ error: "Failed to find calendars" });
  }
})
// : GET invitations (same as GET many)
app.get('/api/calendar/invitations/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) { // check id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database

    const { invitations: invitationIDs } = await CalendarModel.findById(id); // not sure how to prevent second request

    const invitations = await InvitationModel.find({ _id: { $in: invitationIDs } }); // find invitations

    if (!invitations) {
      return res.status(404).json({ message: "Invitations not found" });
    }

    return res.status(200).json(invitations); // send back invitations
  } catch (error) {
    console.error("Error finding invitations:", error);
    return res.status(500).json({ error: "Failed to find invitations" });
  }
})
// : GET calendar
//    | implementation notes
//         > need one for specific id
//             - call this several times to acquire each calendar that the user is subscribed to or owns
//             - other solution would be to call find function to find each calendar within calendar category
app.get('/api/calendar/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id

    if (!id || !mongoose.Types.ObjectId.isValid(id)) { // check id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database

    const calendar = await CalendarModel.findById(id); // find calendar

    if (!calendar) {
      return res.status(404).json({ message: "Calendar not found" });
    }

    return res.status(200).json(calendar); // send back calendar
  } catch (error) {
    console.error("Error finding calendar:", error);
    return res.status(500).json({ error: "Failed to find calendar" });
  }
})
// : POST calendar
app.post('/api/calendar/add', async (req, res) => {
  try {
    const { name } = req.body;

    const _id = new mongoose.Types.ObjectId(); // generate id for adding to user purposes and in case of failure of creation

    await connectMongoDB(); // connect to database

    await UserModel.findByIdAndUpdate(req.session.user, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $addToSet: {
        calendars: _id
      }
    }) // update user with new calendar

    await CalendarModel.create({ _id, name, owner: req.session.user }); // add new calendar

    return res.status(201).json({ message: "Calendar added successfully", _id: _id }); // send back message and calendar id
  } catch (error) {
    console.error("Error adding calendar:", error);
    return res.status(500).json({ error: "Failed to add calendar" });
  }
})
// : PUT calendar
//    | use this for removing subscribers and changing the calendar name
app.put('/api/calendar/update/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id
    const { name, subscribers } = req.body; // get calendar info

    await connectMongoDB(); // connect to database

    await CalendarModel.findByIdAndUpdate(id, { name, subscribers, date_modified: Date.now() }); // update calendar

    return res.status(200).json({ message: "Calendar updated successfully" }); // send back message
  } catch (error) {
    console.error("Error updating calendar:", error);
    return res.status(500).json({ error: "Failed to update calendar" });
  }
})
// : DELETE calendar (owner)
app.delete('/api/calendar/delete/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id

    if (!mongoose.Types.ObjectId.isValid(id)) { // if valid id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database

    await UserModel.findByIdAndUpdate(req.session.user, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $pull: {
        calendars: id // delete calendar from user
      }
    });

    const deletedCalendar = await CalendarModel.findByIdAndDelete(id); // delete calendar

    if (!deletedCalendar) {
      return res.status(404).json({ message: "Calendar not found" }); // if no calendar
    }

    await InvitationModel.deleteMany({ _id: { $in: deletedCalendar.invitations } });

    await UserModel.updateMany( { email: { $in: deletedCalendar.subscribers } }, {
      $set: {
        date_modified: Date.now() // update subscriber last modified
      },
      $pull: {
        calendars: id // delete calendar from subscribers' list
      },
    });

    await UserModel.updateMany({ invitations: { $in: deletedCalendar.invitations } }, {
      $set: {
        date_modified: Date.now() // update subscriber last modified
      },
      $pull: {
        invitations: deletedCalendar.invitations // delete invitation
      }
    });

    return res.status(200).json({ message: "Calendar deleted" }); // send back message
  } catch (error) {
    console.error("Error deleting calendar:", error);
    return res.status(500).json({ error: "Failed to delete calendar" });
  }
})
// : DELETE calendar (subscriber)
app.delete('/api/calendar/unsubscribe/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id

    if (!mongoose.Types.ObjectId.isValid(id)) { // if valid id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database

    const user = await UserModel.findByIdAndUpdate(req.session.user, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $pull: {
        calendars: id // delete calendar from user
      }
    });

    const unsubscribedUser = await CalendarModel.findByIdAndUpdate(id, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $pull: {
        subscribers: user.email // delete user
      }
    }); // delete user

    if (!unsubscribedUser) {
      return res.status(404).json({ message: "User not found" }); // if no calendar
    }

    return res.status(200).json({ message: "Unsubscribed from calendar" }); // send back message
  } catch (error) {
    console.error("Error unsubscribing from calendar:", error);
    return res.status(500).json({ error: "Failed to unsubscribe from calendar" });
  }
})
// /api/date/
// : POST date
app.post('/api/date/add', async (req, res) => {
  try {
    const { calendar: id, name, date, type, priority, to, from } = req.body; // get calendar info

    const _id = new mongoose.Types.ObjectId(); // gen id

    await connectMongoDB(); // connect to database

    // NOTE: could change this implemenation to not need calendar or add verification from bad actors
    // trying to add bad info to date. Should add verification server side or keep client side?
    await CalendarModel.findByIdAndUpdate(id, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $addToSet: {
        dates: new DateModel({ _id, name, date, taskType: type, priority, to, from }) // add date
      }
    });

    return res.status(201).json({ message: "Date added successfully", _id }); // send back message
  } catch (error) {
    console.error("Error adding date:", error);
    return res.status(500).json({ error: "Failed to add date" });
  }
})
// : PUT date
app.put('/api/date/update/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id
    const { calendar, name, date, type, priority, to, from, completed_by } = req.body; // get calendar info

    await connectMongoDB(); // connect to database

    const updatedDate = await CalendarModel.findOneAndUpdate({ _id: calendar, "dates._id": id }, { // find specific calendar with date
      $set: {
        date_modified: Date.now(), // update modification time
        "dates.$": ({ name, date, taskType: type, priority, to, from, date_modified: Date.now() }) // update specific date
      }
    }); // update calendar

    if (!updatedDate) {
      return res.status(404).json({ message: "Date not found" }); // if no calendar
    }

    return res.status(200).json({ message: "Date updated successfully" }); // send back message
  } catch (error) {
    console.error("Error updating date:", error);
    return res.status(500).json({ error: "Failed to update date" });
  }
})
// : PUT date
app.put('/api/date/complete/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id
    const { calendar } = req.body; // get calendar info

    await connectMongoDB(); // connect to database
    const updatedDate = await CalendarModel.findOneAndUpdate({ _id: calendar, "dates._id": id }, { // find specific calendar with date
      $addToSet: {
        "dates.$": ({ completed_by: req.session.user }) // update specific date w/ user ID (can change to email if we want to change it up)
      },
      $set: {
        date_modified: Date.now(), // update modification time
        "dates.$": ({ date_modified: Date.now() }) // update specific date
      }
    }); // update calendar

    if (!updatedDate) {
      return res.status(404).json({ message: "Date not found" }); // if no calendar
    }

    await UserModel.findByIdAndUpdate(req.session.user, {
      $inc: {
        tasks_completed: 1, // increment tasks completed
      },
    })

    return res.status(200).json({ message: "Date updated successfully" }); // send back message
  } catch (error) {
    console.error("Error updating date:", error);
    return res.status(500).json({ error: "Failed to update date" });
  }
})
// : PUT date
app.put('/api/date/uncomplete/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id
    const { calendar } = req.body; // get calendar info

    await connectMongoDB(); // connect to database
    const updatedDate = await CalendarModel.findOneAndUpdate({ _id: calendar, "dates._id": id }, { // find specific calendar with date
      $pull: {
        "dates.$": ({ completed_by: req.session.user }) // remove specific date w/ user ID (can change to email if we want to change it up)
      },
      $set: {
        date_modified: Date.now(), // update modification time
        "dates.$": ({ date_modified: Date.now() }) // update specific date
      }
    }); // update calendar

    if (!updatedDate) {
      return res.status(404).json({ message: "Date not found" }); // if no calendar
    }

    await UserModel.findByIdAndUpdate(req.session.user, {
      $inc: {
        tasks_completed: -1, // decrement tasks completed
      },
    })

    return res.status(200).json({ message: "Date updated successfully" }); // send back message
  } catch (error) {
    console.error("Error updating date:", error);
    return res.status(500).json({ error: "Failed to update date" });
  }
})
// : DELETE date
app.delete('/api/date/delete/:calendar/:id', async (req, res) => {
  try {
    const { id, calendar } = req.params; // get id

    if (!mongoose.Types.ObjectId.isValid(id)) { // if valid id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database

    const deletedDate = await CalendarModel.findOneAndUpdate({ _id: calendar, "dates._id": id }, { // find calendar with date
      $set: {
        date_modified: Date.now(), // update modified time
      },
      $pull: {
        dates: { _id: id } // delete specific date
      }
    });

    if (!deletedDate) {
      return res.status(404).json({ message: "Date not found" }); // if no calendar
    }

    return res.status(200).json({ message: "Date deleted" }); // send back message
  } catch (error) {
    console.error("Error deleting date:", error);
    return res.status(500).json({ error: "Failed to delete date" });
  }
})
// /api/invite
// : POST invite
app.post('/api/invitation/create', async (req, res) => {
  try {
    const { calendar, name, to } = req.body; // get id

    await connectMongoDB(); // connect to database

    const { from } = await UserModel.findById(req.session.user);

    const invitation = await InvitationModel.create({ _id, calendar, name, to, from });

    await UserModel.findByIdAndUpdate(to, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $addToSet: {
        invitations: invitation._id // add invitation
      }
    }); // update user

    await CalendarModel.findByIdAndUpdate(calendar, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $addToSet: {
        invitations: invitation._id // add invitation
      }
    }); // update calendar

    return res.status(200).json({ message: "Invitation created successfully" }); // send back message
  } catch (error) {
    console.error("Error creating invitation:", error);
    return res.status(500).json({ error: "Failed to create invitation" });
  }
})
// : GET invitations
app.get('/api/invitation/', async (req, res) => {
  try {
    await connectMongoDB(); // connect to database

    const { invitations: invitationIDs } = await UserModel.findById(req.session.user); // not sure how to prevent second request

    const invitations = await InvitationModel.find({ _id: { $in: invitationIDs } }); // find invitations

    if (!invitations) {
      return res.status(404).json({ message: "Invitations not found" });
    }

    return res.status(200).json(invitations); // send back invitations
  } catch (error) {
    console.error("Error finding invitations:", error);
    return res.status(500).json({ error: "Failed to find invitations" });
  }
})
// : DELETE invitation
app.delete('/api/invitation/delete/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id

    if (!mongoose.Types.ObjectId.isValid(id)) { // if valid id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database

    const deletedInvitation = await InvitationModel.findOneAndDelete(id);

    if (!deletedInvitation) {
      return res.status(404).json({ message: "Invitation not found" }); // if no calendar
    }

    await UserModel.findOneAndUpdate(deletedInvitation.to, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $pull: {
        invitations: deletedInvitation._id // delete invitation
      }
    }); // update user

    await CalendarModel.findByIdAndUpdate(deletedInvitation.calendar, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $pull: {
        invitations: deletedInvitation._id // delete invitation
      }
    }); // update calendar

    return res.status(200).json({ message: "Invitation deleted" }); // send back message
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return res.status(500).json({ error: "Failed to delete invitation" });
  }
})
// : POST invitation
app.post('/api/invitation/accept/:id', async (req, res) => {
  try {
    const { id } = req.params; // get id

    if (!mongoose.Types.ObjectId.isValid(id)) { // if valid id
      return res.status(400).json({ message: "Invalid ID format" });
    }

    await connectMongoDB(); // connect to database

    const invitation = await InvitationModel.findOneAndDelete(id);

    const user = await UserModel.findByIdAndUpdate(req.session.user, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $addToSet: {
        calendars: invitation.calendar // add calendar
      },
      $pull: {
        invitations: id // delete invitation
      }
    }); // update user

    await CalendarModel.findByIdAndUpdate(invitation.calendar, {
      $set: {
        date_modified: Date.now() // update calendar last modified
      },
      $addToSet: {
        subscribers: user.email // add user
      },
      $pull: {
        invitations: id // delete invitation
      }
    }); // update calendar

    return res.status(200).json({ message: "Invitation accepted successfully" }); // send back message
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ error: "Failed to accept invitation" });
  }
})

// API port
app.listen(8080, () => {
  console.log('server listening on port 8080')
})


