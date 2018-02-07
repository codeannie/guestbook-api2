const { format } = require('date-fns');
const faker = require('faker');

function createOne(userId) {
  return {
    userId: userId,
    eventName: faker.company.catchPhraseDescriptor(),
    description: faker.hacker.phrase(),
    date: faker.date.future(),
    startTime: faker.date.future(),
    endTime: faker.date.future(),
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