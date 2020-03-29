'use strict';

const fs = require(`fs`);
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);
const commentService = require(`../control-units/comment`);
const annoucementService = require(`../control-units/announcement`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];


router.get(`/`, async (req, res) => {
  try {
    res.send(content);
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.get(`/:offerId`, async (req, res) => {
  try {
    res.send(content.filter((el) => el.id === req.params.offerId.toString()));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    content = annoucementService.add(content, req.body);
    res.send(content);
  }
});

router.put(`/:offerId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    content = annoucementService.change(content, req.body, req.params.offerId);
    res.send(content);
  }
});

router.delete(`/:offerId`, (req, res) => {
  try {
    content = annoucementService.deleteAnnouncment(content, req.params.offerId);
    if (content !== -1) {
      res.send(content);
    } else {
      res.status(400).send(`Невозможно удалить объявление, так как
    оно не обнаружено в списке объявлений.`);
    }
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.get(`/:offerId/comments`, async (req, res) => {
  try {
    const announcment = content.find((el) => el.id === req.params.offerId.toString());
    res.send(announcment.comments);
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.delete(`/:offerId/comments/:commentId`, (req, res) => {
  try {
    content = commentService.deleteComment(content, req.params.offerId, req.params.commentId);
    if (content !== -1) {
      res.send(content);
    } else {
      res.status(400).send(`Невозможно удалить объявление, так как
    оно не обнаружено в списке объявлений.`);
    }
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.put(`/:offerId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send({error: `Переданы не все поля для нового комментария.`});
  } else {
    content = commentService.add(content, req.body, req.params.offerId);
    res.send(content);
  }
});


module.exports = router;
