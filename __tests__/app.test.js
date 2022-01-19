const db = require('../db/connection.js');
const app = require('../app');
const request = require('supertest');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/topics', () => {
  describe('GET', () => {
    test('Return status code 200 and an object with key topics and value of all the topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          expect(body).hasOwnProperty('topics');
          if (body.topics.length !== 0) {
            body.topics.forEach((topic) => {
              expect(topic).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String),
              });
            });
          } else {
            fail('Error, Body Is Empty');
          }
        });
    });
  });
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    test('Return status code 200 and the correct comment count', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          expect(body.result).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 100,
            author: 'butter_bridge',
            topic: 'mitch',
            created_at: '2020-07-09T20:11:00.000Z',
            comment_count: '11',
          });
        });
    });

    test('Return status code 404 with an error message if article_id is valid but not found', () => {
      return request(app)
        .get('/api/articles/300000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });

    test('Return status code 400 with error message if article_id is invalid', () => {
      return request(app)
        .get('/api/articles/a')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });

  describe('PATCH', () => {
    test('Return status code 201, increment votes by 10 and return object', () => {
      const increaseVotes = { inc_votes: 10 };

      return request(app)
        .patch('/api/articles/1')
        .send(increaseVotes)
        .expect(201)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          expect(body.result).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 110,
            author: 'butter_bridge',
            topic: 'mitch',
            created_at: '2020-07-09T20:11:00.000Z',
          });
        });
    });

    test('Return status code 201, decrement votes by 10 and return object', () => {
      const decreaseVotes = { inc_votes: -10 };

      return request(app)
        .patch('/api/articles/1')
        .send(decreaseVotes)
        .expect(201)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          expect(body.result).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            body: 'I find this existence challenging',
            votes: 90,
            author: 'butter_bridge',
            topic: 'mitch',
            created_at: '2020-07-09T20:11:00.000Z',
          });
        });
    });

    test('Return status code 404 with an error message if article_id is valid but not found', () => {
      const increaseVotes = { inc_votes: 10 };

      return request(app)
        .patch('/api/articles/300000')
        .send(increaseVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });

    test('Return status code 400 with error message if article_id is invalid', () => {
      const increaseVotes = { inc_votes: 10 };
      return request(app)
        .patch('/api/articles/a')
        .send(increaseVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
});

describe('/api/articles', () => {
  describe('GET', () => {
    test('Return status code 200 and an articles array of each article', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          body.result.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });

    test('Return status code 200 and should be sorted by date as default', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.result).toBeSortedBy('created_at', { descending: true });
        });
    });

    test('Return status code 200 and should be sorted by article_id', () => {
      return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({ body }) => {
          expect(body.result).toBeSortedBy('article_id', {
            descending: true,
          });
        });
    });

    test('Return status code 200 and should be ordered by desc as default', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.result).toBeSorted({ descending: true });
        });
    });

    test('Return status code 200 and should be ordered by asc', () => {
      return request(app)
        .get('/api/articles?order_by=ASC')
        .expect(200)
        .then(({ body }) => {
          expect(body.result).toBeSorted({ ascending: true });
        });
    });

    test('Return status code 200 and should be a specific topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          body.result.forEach((article) => {
            expect(article.topic).toBe('mitch');
          });
        });
    });

    test('Return status code 400 with bad request if sort by is incorrect', () => {
      return request(app)
        .get('/api/articles?sort_by=NotAColumn')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });

    test('Return status code 400 with bad request if order by is incorrect', () => {
      return request(app)
        .get('/api/articles?order_by=ASCSS')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });

    test('Return status code 400 with bad request if topic is incorrect', () => {
      return request(app)
        .get('/api/articles?topic=1')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
});
