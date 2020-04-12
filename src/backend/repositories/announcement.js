'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let announcements = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const findById = (id) => announcements.find((el) => el.id === id);

const exists = (id) => findById(id) !== undefined;

const findAll = () => announcements;

const save = (newAnnouncement, id) => {
  if (id) {
    const announcement = announcements.find((el) => el.id === id);
    const newContent = deleteItemFromArray(announcements, id);
    const newOffer = Object.assign({}, announcement, newAnnouncement);
    newContent.push(newOffer);
    announcements = newContent;
  } else {
    newAnnouncement.id = getNewId();
    announcements.push(newAnnouncement);
  }
  return newAnnouncement.id;
};

const remove = (id) => {
  announcements = deleteItemFromArray(announcements, id);
};

const findByTitle = (queryString) => {
  return announcements.filter((el) => el.title.toUpperCase().includes(queryString.toUpperCase()));
};


module.exports = {
  exists,
  findById,
  findAll,
  save,
  findByTitle,
  remove,
};