'use strict';

const Sequelize = require(`sequelize`);
const Operator = Sequelize.Op;
require(`dotenv`).config();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const {types, users, categories, announcements, announcementsToCategories,
  images, comments} = require(`./mocks`);

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`,
    `${process.env.USER_PASSWORD}`,
    {
      host: `${process.env.DB_HOST}`,
      dialect: `${process.env.DIALECT}`,
    }
);

const Announcement = require(`./models/announcement`)(sequelize, Sequelize);
const AnnouncementsToCategory = require(`./models/announcements_to_category`)(sequelize, Sequelize);
const Category = require(`./models/category`)(sequelize, Sequelize);
const Comment = require(`./models/comment`)(sequelize, Sequelize);
const Image = require(`./models/image`)(sequelize, Sequelize);
const Type = require(`./models/type`)(sequelize, Sequelize);
const User = require(`./models/user`)(sequelize, Sequelize);

// Связь между таблицами types и announcements
// Type.hasMany(Announcement, {
//   as: `announcements`,
//   foreignKey: `typeId`,
// });

Announcement.belongsTo(Type, {
  as: `types`,
  foreignKey: `typeId`,
});

// Связь между таблицами users и announcements
User.hasMany(Announcement, {
  as: `announcements`,
  foreignKey: `userId`,
});

// Связь между таблицами announcements и users
Announcement.belongsTo(User, {
  as: `users`,
  foreignKey: `userId`,
});

// Связь между таблицами users и comments
User.hasMany(Comment, {
  as: `comments`,
  foreignKey: `userId`,
});

// Связь между таблицами comments и users
Comment.belongsTo(User, {
  as: `users`,
  foreignKey: `userId`,
});

// Связь между таблицами announcements и comments
Announcement.hasMany(Comment, {
  as: `comments`,
  foreignKey: `announcementId`,
});

// Связь между таблицами announcements и images
Announcement.hasMany(Image, {
  as: `images`,
  foreignKey: `announcementId`,
});

// Связь между таблицами announcements и announcements_to_categories
Announcement.hasMany(AnnouncementsToCategory, {
  as: `announcementsToCategories`,
  foreignKey: `announcementId`,
});

// Связь между таблицами announcements и announcements_to_categories
Category.hasMany(AnnouncementsToCategory, {
  as: `announcementsToCategories`,
  foreignKey: `categoryId`,
});


const initDb = async () => {
  await sequelize.sync({force: true});
  console.log(`Структура БД успешно создана`);

  await Type.bulkCreate(types);
  await User.bulkCreate(users);
  await Category.bulkCreate(categories);
  await Announcement.bulkCreate(announcements);
  await AnnouncementsToCategory.bulkCreate(announcementsToCategories);
  await Image.bulkCreate(images);
  await Comment.bulkCreate(comments);
};

const addData = async () => {
  try {
    return await Announcement.create({
      title: `some title`,
      description: `some description`,
      sum: 5345,
      userId: 3,
      typeId: 1,
    });
  } catch (err) {
    return err.message;
  }
};

const testConnect = async () => {
  try {
    logger.info(`Устанавливаем соединение с сервером`);
    await sequelize.authenticate();
    logger.info(`Соединение с сервером установлено!`);
  } catch (err) {
    console.error(`Не удалось установить соединение по причине: ${err}`);
    logger.error(`Не удалось установить соединение по причине: ${err}`);
    process.exit();
  }
};

module.exports = {
  db: {
    Announcement,
    AnnouncementsToCategory,
    Category,
    Comment,
    Image,
    Type,
    User,
  },
  testConnect,
  initDb,
  addData,
  sequelize,
  Operator,
};