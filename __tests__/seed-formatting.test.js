const db = require('../db/connection');
const {
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
} = require('../utils/seed-formatting');

afterAll(() => db.end());

describe('formatTopics()', () => {
  test('Should return true if the return value of the function is an array', () => {
    const topics = [
      { slug: 'games', description: 'the description of a game' },
      { slug: 'movies', description: 'the desctiption of a movie' },
    ];
    expect(Array.isArray(formatTopics(topics))).toBe(true);
  });
  test('Should take an array of objects and return an array of arrays containing only the values of the original objects', () => {
    const topics = [
      { slug: 'games', description: 'the description of a game' },
      { slug: 'movies', description: 'the description of a movies' },
    ];
    expect(formatTopics(topics)).toEqual([
      ['games', 'the description of a game'],
      ['movies', 'the description of a movies'],
    ]);
  });
  test('Should not mutate the original array', () => {
    const topics = [
      { slug: 'games', description: 'the description of a game' },
      { slug: 'movies', description: 'the description of a movies' },
    ];
    expect(formatTopics(topics)).toEqual([
      ['games', 'the description of a game'],
      ['movies', 'the description of a movies'],
    ]);
    expect(topics).toEqual([
      { slug: 'games', description: 'the description of a game' },
      { slug: 'movies', description: 'the description of a movies' },
    ]);
  });
});

describe('formatUsers()', () => {
  test('Should return true if the return value of the function is an array', () => {
    const users = [
      {
        username: 'apple_duck',
        name: 'james',
        avatar_url: 'https://www.google.com/',
      },
      {
        username: 'larry_cheese',
        name: 'larry',
        avatar_url: 'https://www.youtube.com/',
      },
    ];
    expect(Array.isArray(formatUsers(users))).toBe(true);
  });
  test('Should take an array of objects and return an array of arrays containing only the values of the original objects', () => {
    const users = [
      {
        username: 'apple_duck',
        name: 'James',
        avatar_url: 'https://www.google.com/',
      },
      {
        username: 'larry_cheese',
        name: 'Larry',
        avatar_url: 'https://www.youtube.com/',
      },
    ];
    expect(formatUsers(users)).toEqual([
      ['apple_duck', 'https://www.google.com/', 'James'],
      ['larry_cheese', 'https://www.youtube.com/', 'Larry'],
    ]);
  });
  test('Should not mutate the original array', () => {
    const users = [
      {
        username: 'apple_duck',
        name: 'James',
        avatar_url: 'https://www.google.com/',
      },
      {
        username: 'larry_cheese',
        name: 'Larry',
        avatar_url: 'https://www.youtube.com/',
      },
    ];
    expect(formatUsers(users)).toEqual([
      ['apple_duck', 'https://www.google.com/', 'James'],
      ['larry_cheese', 'https://www.youtube.com/', 'Larry'],
    ]);
    expect(users).toEqual([
      {
        username: 'apple_duck',
        name: 'James',
        avatar_url: 'https://www.google.com/',
      },
      {
        username: 'larry_cheese',
        name: 'Larry',
        avatar_url: 'https://www.youtube.com/',
      },
    ]);
  });
});

describe('formatArticles()', () => {
  test('Should return true if the return value of the function is an array', () => {
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T21:11:00.000Z',
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell',
        created_at: '2020-10-16T06:03:00.000Z',
        votes: 0,
      },
    ];
    expect(Array.isArray(formatArticles(articles))).toBe(true);
  });
  test('Should take an array of objects and return an array of arrays containing only the values of the original objects', () => {
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T21:11:00.000Z',
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell',
        created_at: '2020-10-16T06:03:00.000Z',
        votes: 0,
      },
    ];
    expect(formatArticles(articles)).toEqual([
      [
        'Living in the shadow of a great man',
        'I find this existence challenging',
        100,
        'mitch',
        'butter_bridge',
        '2020-07-09T21:11:00.000Z',
      ],
      [
        'Sony Vaio; or, The Laptop',
        'Call me Mitchell',
        0,
        'mitch',
        'icellusedkars',
        '2020-10-16T06:03:00.000Z',
      ],
    ]);
  });
  test('Should not mutate the original array', () => {
    const articles = [
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T21:11:00.000Z',
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell',
        created_at: '2020-10-16T06:03:00.000Z',
        votes: 0,
      },
    ];
    expect(formatArticles(articles)).toEqual([
      [
        'Living in the shadow of a great man',
        'I find this existence challenging',
        100,
        'mitch',
        'butter_bridge',
        '2020-07-09T21:11:00.000Z',
      ],
      [
        'Sony Vaio; or, The Laptop',
        'Call me Mitchell',
        0,
        'mitch',
        'icellusedkars',
        '2020-10-16T06:03:00.000Z',
      ],
    ]);
    expect(articles).toEqual([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: '2020-07-09T21:11:00.000Z',
        votes: 100,
      },
      {
        title: 'Sony Vaio; or, The Laptop',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Call me Mitchell',
        created_at: '2020-10-16T06:03:00.000Z',
        votes: 0,
      },
    ]);
  });
});

describe('formatComments()', () => {
  test('Should return true if the return value of the function is an array', () => {
    const comments = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: '2020-10-16T06:03:00.000Z',
      },
      {
        body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        votes: 14,
        author: 'butter_bridge',
        article_id: 1,
        created_at: '2020-10-16T06:03:00.000Z',
      },
    ];
    expect(Array.isArray(formatComments(comments))).toBe(true);
  });
  test('Should take an array of objects and return an array of arrays containing only the values of the original objects', () => {
    const comments = [
      {
        body: 'body',
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: '2020-10-16T06:03:00.000Z',
      },
      {
        body: 'body2',
        votes: 14,
        author: 'butter_bridge',
        article_id: 1,
        created_at: '2020-10-16T06:03:00.000Z',
      },
    ];
    expect(formatComments(comments)).toEqual([
      ['butter_bridge', 9, 16, '2020-10-16T06:03:00.000Z', 'body'],
      ['butter_bridge', 1, 14, '2020-10-16T06:03:00.000Z', 'body2'],
    ]);
  });
  test('Should not mutate the original array', () => {
    const comments = [
      {
        body: 'body',
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: '2020-10-16T06:03:00.000Z',
      },
      {
        body: 'body2',
        votes: 14,
        author: 'butter_bridge',
        article_id: 1,
        created_at: '2020-10-16T06:03:00.000Z',
      },
    ];
    expect(formatComments(comments)).toEqual([
      ['butter_bridge', 9, 16, '2020-10-16T06:03:00.000Z', 'body'],
      ['butter_bridge', 1, 14, '2020-10-16T06:03:00.000Z', 'body2'],
    ]);
    expect(comments).toEqual([
      {
        body: 'body',
        votes: 16,
        author: 'butter_bridge',
        article_id: 9,
        created_at: '2020-10-16T06:03:00.000Z',
      },
      {
        body: 'body2',
        votes: 14,
        author: 'butter_bridge',
        article_id: 1,
        created_at: '2020-10-16T06:03:00.000Z',
      },
    ]);
  });
});
