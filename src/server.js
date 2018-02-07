const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const { DATABASE_URL, PORT } = require('./config');
const authRouter = require('./auth/auth.routes');
const userRouter = require('./user/user.router');
const eventRouter = require('./event/event.router');
const guestRouter = require('./event/guest.router');
const { jwtStrategy } = require('./auth/auth.strategies');
const { CLIENT_ORIGIN } = require('./config');

// create new express app
const app = express(); 

// configure CORS w dynamic origin
const whiteList = ['http://localhost:3000', CLIENT_ORIGIN];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(
    cors(corsOptions)
);

// use these middleware for the app
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(passport.initialize());
passport.use(jwtStrategy);

mongoose.Promise = global.Promise;

// establish routes 
// this is the base URL to manage
app.use('/api/events', eventRouter); 
app.use('/api/guests', guestRouter);
app.use('/api/auth', authRouter);

let server; 

// connect to mongo database & start the express server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// close the express server
function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { runServer, app, closeServer };
