'use strict';

const commentRepository = require(`../repositories/comment`);
const announcementRepository = require(`../repositories/announcement`);
jest.mock(`../repositories/comment`);
jest.mock(`../repositories/announcement`);

const underTest = require(`./comment`);
const {AnnouncementNotFoundError, CommentNotFoundError} = require(`../errors/errors`);

const MOCK_ID = 123456;

describe(`getByAnnouncementId`, () => {
  test(`if announcement and comments exist should return comments`, () => {
    const expectedComments = [``, ``, ``];
    announcementRepository.exists.mockReturnValue(true);
    commentRepository.findByAnnouncementId.mockReturnValue(expectedComments);

    const actual = underTest.getByAnnouncementId(MOCK_ID);

    expect(actual).toEqual(expectedComments);
  });
});

describe(`add`, () => {
  test(`existing announcement should create new comment and return its id`, () => {
    announcementRepository.exists.mockReturnValue(true);
    commentRepository.save.mockReturnValue(MOCK_ID);

    const actual = underTest.add({text: `some text`});

    expect(actual).toBe(MOCK_ID);
  });

  test(`for non-existing announcement should return error`, () => {
    announcementRepository.exists.mockReturnValue(false);

    expect(() => underTest.add({}, MOCK_ID))
      .toThrowError(new AnnouncementNotFoundError(MOCK_ID));
  });
});

describe(`remove`, () => {
  test(`should return 'true' if existing comment was successfully deleted`, () => {
    commentRepository.exists.mockReturnValue(true);
    commentRepository.remove.mockReturnValue(true);

    const actual = underTest.remove(MOCK_ID, MOCK_ID);

    expect(actual).toBe(true);
  });

  test(`for non-existing comment should return error`, () => {
    commentRepository.exists.mockReturnValue(false);

    expect(() => underTest.remove(MOCK_ID, MOCK_ID))
      .toThrowError(new CommentNotFoundError(MOCK_ID, MOCK_ID));
  });
});
