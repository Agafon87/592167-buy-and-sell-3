'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  try {
    const content = await fs.readFile(MOCK_FILE_NAME);
    res.send(JSON.parse(content));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});
router.get(`/:offerId`, async (req, res) => {
  try {
    const content = await fs.readFile(MOCK_FILE_NAME);
    res.send(JSON.parse(content).filter((el) => el.id === req.params.offerId.toString()));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

module.exports = router;
