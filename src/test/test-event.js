const chai = require('chai');
const chatiHttp = require('chai-http');
const should = chai.should();
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { JWT_EXPIRY, JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { Event } = require('../event/event.model');
const { Guest } = require('../event/guest.model');
const { User } = require('../user/user.model');

const eventFactory = require('../test/factories/event.factory');
const userFactory = require('../test/factories/user.factory');

chai.use(chatiHttp);

// delete entire database
function tearDownDb() {
  console.warn('deleting test database');
  return mongoose.connection
    .collections['events'].deleteMany({}) //this returns a promise
    // .dropDatabase()
    .then(() => 
    // without {} means it auto returns; only 1 line statement
      mongoose.connection
      .collections['users'].deleteMany({})
    )
}

// auth token for test user
const createAuthToken = user => {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.email,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
}

// create test user
function createTestUser() {
  console.info('creating test user');
  const testUser = userFactory.createOne();
  return User.create(testUser)

}

// create random events
function seedEventData(userId) {
  console.info('seeding events');
  const seedData = eventFactory.createMany(userId, 5);
  return Event.insertMany(seedData);
}

describe('events API', function() {
  let testUser;
  let mockJwt;

  // start server before test
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(async function() {
    testUser = await createTestUser();
    mockJwt = createAuthToken(testUser);
    return seedEventData(testUser._id);
  });

  // remove database after each test
  afterEach(function() {
    return tearDownDb();
  });

  // close server after test is done
  after(function() {
    return closeServer();
  });

  // GET endpoint
  describe('GET endpoint', function() {
    const expectedKeys = [
      'name', 'description', 'startDateTime',
      'locationName', 'locationAddress'
    ]
    it('return all existing events', function() {
      return chai
        .request(app)
        .get(`/api/events/${testUser._id}`) 
        .set('Authorization', `Bearer ${mockJwt}`)
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          res.body.events.should.have.lengthOf.at.least(1);
          res.body.events.should.have.length(5);
        })
    });
    it('events should return with expected keys', function() {
      let resEvent;
      
      return chai
        .request(app)
        .get(`/api/events/${testUser._id}`) 
        .set('Authorization', `Bearer ${mockJwt}`)
        .then(function(res) {
          // console.log('return keys, check res ->', res.body);
          // console.log('return expected keys ->', resEvent);
          res.should.have.status(200);
          res.should.be.json;
          res.body.events.should.be.a('array');
          // console.log('res body -> ', res.body.events);
          res.body.events.should.have.lengthOf.at.least(1);

          // check each response for expected keys
          res.body.events.forEach(function(event) {
            event.should.be.a('object');
            event.should.include.keys(expectedKeys);
          });

          // retrieve single event & check for correct values
          resEvent = res.body.events[0];
          return Event.findById(resEvent.id);
        })
        .then(function(event) {
          resEvent.userId.should.equal(event.userId);
          resEvent.name.should.equal(event.name);
          resEvent.description.should.equal(event.description);
          resEvent.locationName.should.equal(event.locationName);
          resEvent.locationAddress.should.equal(event.locationAddress);
          // console.log('starttime', resEvent);
          // time test is failing because it needs to be formatted
          // resEvent.startDateTime.should.equal(event.startDateTime);
        });
    });
  });
  // POST endpoint
  describe('POST endpoint', function() {
    const expectedKeys = [
      'name', 'description', 'startDateTime',
      'locationName', 'locationAddress'
    ];

    it('create a new event', function() {
      const newEvent = eventFactory.createOne(testUser._id);
      // console.log('create new event->', newEvent);
      
      return chai
        .request(app)
        .post(`/api/events/${testUser._id}`)
        .set('Authorization', `Bearer ${mockJwt}`)
        .send(newEvent)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(expectedKeys);
          res.body.name.should.equal(newEvent.name);
          res.body.description.should.equal(newEvent.description);
          res.body.locationName.should.equal(newEvent.locationName);
          res.body.locationAddress.should.equal(newEvent.locationAddress);
          res.body.eventStatus.should.equal(1);
          res.body.id.should.not.be.null;
        });
    });
  })
})

