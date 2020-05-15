'use strict';

const {Router} = require(`express`);
const router = new Router();

const request = require(`request-promise-native`);
const {MOCK_URL} = require(`../../constants`);

router.get(`/category`, (req, res) => {
  res.render(`category`);
});
router.get(`/category/:id`, (req, res) => {
  res.render(`category`);
});
router.get(`/add`, (req, res) => res.send(req.originalUrl));
router.get(`/edit/:id`, (req, res) => {
  request(`${MOCK_URL}/api/offers/${req.params.id}`, {json: true})
    .then((content) => console.log(content));
  res.send(req.originalUrl);
});
router.get(`/:id`, (req, res) => res.send(req.originalUrl));

module.exports = router;
