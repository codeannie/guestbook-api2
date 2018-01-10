const eventStatus = {
  ACTIVE: 1,
  PAST: 2, 
  ARCHIVE: 3
};

const guestStatus = {
  NO_RESPONSE: 0,
  CONFIRMED: 1,
  DECLINED: 2,
  TENTATIVE: 3,
  MAYBE: 4 // keep? 
}

module.exports = {
  eventStatus,
  guestStatus
}