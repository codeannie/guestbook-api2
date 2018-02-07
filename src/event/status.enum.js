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
}

module.exports = {
  eventStatus,
  guestStatus
}