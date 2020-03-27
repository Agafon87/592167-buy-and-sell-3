'use strict';

const fs = require(`fs`);
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);
const {searchAnnouncements} = require(`../control-units/announcement`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

router.get(`/`, (req, res) => {
  try {

    res.send(searchAnnouncements(content, req.query));
  } catch (err) {
    console.log(chalk.red(err));
    res.status(404).send(`Нет такой страницы`);
  }
});

module.exports = router;