const DATABASE_URL = process.env.DATABASE_URL || 
                    global.DATABASE_URL ||
                    'mongodb://localhost/guestbook';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                          'mongodb://localhost/test-guestbook';

const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'ManageGuestbook2017';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
const CLIENT_ORIGIN = 'http://localhost:3000' // process.env.CLIENT_ORIGIN || 

module.exports = { 
  CLIENT_ORIGIN, 
  DATABASE_URL, 
  JWT_EXPIRY, 
  JWT_SECRET, 
  PORT, 
  TEST_DATABASE_URL
};