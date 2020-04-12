'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const announcementService = require(`../services/announcement`);

router.get(`/`, (req, res) => {
  try {
    res.send(announcementService.search(req.query.query));
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

module.exports = router;