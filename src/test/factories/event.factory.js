const faker = require('faker');

function createOne(userId) {
  return {
    userId: userId,
    name: faker.company.catchPhraseDescriptor(),
    description: faker.hacker.phrase(),
    startDateTime: faker.date.future(),
    endDateTime: faker.date.future(),
    locationName: faker.hacker.noun(),
    locationAddress: faker.address.streetAddress(),
    eventStatus: 1,
    createdDate: new Date()
  }
}

function createMany(userId, num) {
  let events = [];
  for (let i = 0; i < num; i++) {
    events.push(createOne(userId));
  }
  return events;
}

module.exports = { createOne, createMany };