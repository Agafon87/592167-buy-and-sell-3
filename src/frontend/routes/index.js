'use strict';

const axios = require(`axios`);
const shemaValidator = require(`../../middleware/shema-validator`);
const update = require(`../../middleware/save-photo`);
const userSchema = require(`../../backend/validation-schemas/user-schema`);

const {BACKEND_URL, FRONTEND_URL, TEMPLATE} = require(`../../constants`);

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);
const errorsRoutes = require(`./errors`);


const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);
  app.use(`/errors`, errorsRoutes);


  app.get(`/`, async (req, res) => {
    try {
      const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
      const categories = resCategories.data;
      const resNewAnnouncements = await axios.get(`${BACKEND_URL}/api/offers/newestAnnouncements`);
      const newAnnouncements = resNewAnnouncements.data;
      const resMostDiscussed = await axios.get(`${BACKEND_URL}/api/offers/mostdiscussed`);
      const mostDiscussed = resMostDiscussed.data;
      const mainPage = {
        categories,
        newAnnouncements,
        mostDiscussed,
        FRONTEND_URL,
      };
      res.render(`index`, {mainPage});
    } catch (err) {
      res.render(`./errors/500`, {err});
    }
  });

  app.get(`/register`, (req, res) => {
    res.render(`sign-up`);
  });

  app.post(`/register`, [
    update(TEMPLATE.REGISTER),
    shemaValidator(userSchema, TEMPLATE.REGISTER),
  ], async (req, res) => {
    try {
      // console.log(req.file);
      res.render(`login`);
    } catch (err) {
      // console.error(err, req.file);
    }
  });

  app.get(`/login`, (req, res) => {
    res.render(`login`);
  });

  app.get(`/search`, async (req, res) => {
    try {
      const response = await axios.get(encodeURI(`${BACKEND_URL}/api/search?query=${req.query.search}`));
      const announcements = response.data;
      res.render(`search-result`, {announcements});
    } catch (err) {
      res.render(`500`, {err});
    }
  });
};


module.exports = {
  initializeRoutes
};
