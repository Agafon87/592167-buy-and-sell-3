'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`http-status-codes`);
const chalk = require(`chalk`);
const {getLogger} = require(`../logger`);
const logger = getLogger();

const multer = require(`multer`);
const md5 = require(`md5`);

const annoucementService = require(`../services/announcement`);
const {DEFAULT, FRONTEND_URL} = require(`../../constants`);


const UPLOAD_DIR = `${__dirname}/../../static/upload`;

const MimeTypeExtension = {
  'image/png': `png`,
  'image/jpeg': `jpg`,
  'image/jpg': `jpg`,
};

const maxFileSize = 5 * 1024 * 1024;

// Подготовка хранилища для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const fileExtention = MimeTypeExtension[file.mimetype];
    cb(null, `${md5(Date.now())}.${fileExtention}`);
  },
});

// Функция определяющая допустимые файлы для загрузки
const fileFilter = (req, file, cb) => {
  const allowTypes = Object.keys(MimeTypeExtension);
  const isValid = allowTypes.includes(file.mimetype);
  cb(null, isValid);
};

const upload = multer({
  storage, fileFilter, limits: {
    fileSize: maxFileSize,
  }
});

const router = new Router();


router.get(`/`, async (req, res) => {
  try {
    res.send(await annoucementService.getAll());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/my`, async (req, res) => {
  try {
    res.send(await annoucementService.getMyAnnouncements());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/my/comments`, async (req, res) => {
  try {
    res.send(await annoucementService.getListCommentsForUserAnnouncements(3));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/newestAnnouncements`, async (req, res) => {
  try {
    res.send(await annoucementService.getTheNewestAnnouncements(DEFAULT.PREVIEW_COUNT));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/mostDiscussed`, async (req, res) => {
  try {
    res.send(await annoucementService.getMostDiscussed(DEFAULT.PREVIEW_COUNT));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({
      code: StatusCode.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.post(`/add`, upload.single(`avatar`), async (req, res) => {
  try {
    const data = req.body;
    data.image = req.file.filename;

    await annoucementService.create(data);
    res.redirect(`${FRONTEND_URL}/my`);
  } catch (err) {
    res.redirect(`${FRONTEND_URL}/offers/add`);
  }
});

router.post(`/:id`, upload.single(`avatar`), async (req, res) => {
  const data = req.body;
  data.image = req.file.filename;
  try {
    await annoucementService.edit(data, req.params.id);
    res.redirect(`${FRONTEND_URL}/offers/${req.params.id}`);
  } catch (err) {
    res.send(err);
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    res.send(await annoucementService.getAnnouncement(req.params.id));
  } catch (err) {
    res.send(err);
  }
});

router.post(`/:id/comments`, async (req, res) => {
  try {
    const newComment = req.body;
    newComment.offersId = req.params.id;
    newComment.userId = `3`;
    await annoucementService.addComment(newComment);
    res.redirect(`${FRONTEND_URL}/offers/${req.params.id}`);
  } catch (err) {
    res.send(err);
  }
});


module.exports = router;
