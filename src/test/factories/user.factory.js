const faker = require('faker');

function createOne() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

function createMany(num) {
  let users = [];
  for (let i = 0; i < num; i++) {
    users.push(createOne());
  }
  return users;
}

module.exports = { createOne, createMany };