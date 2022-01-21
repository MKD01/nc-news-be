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
          expect(body.article).toEqual({
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
          expect(body.article).toEqual({
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
          expect(body.article).toEqual({
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
          body.articles.forEach((article) => {
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
          expect(body.articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });

    test('Return status code 200 and should be sorted by article_id', () => {
      return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy('article_id', {
            descending: true,
          });
        });
    });

    test('Return status code 200 and should be ordered by desc as default', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ descending: true });
        });
    });

    test('Return status code 200 and should be ordered by asc', () => {
      return request(app)
        .get('/api/articles?order_by=ASC')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ ascending: true });
        });
    });

    test('Return status code 200 and should be a specific topic', () => {
      return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
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

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('Return status code 200 with an array of comments for the given article id', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          body.comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              body: expect.any(String),
              author: expect.any(String),
            });
          });
        });
    });

    test('Return status code 400 if article_id is not valid', () => {
      return request(app)
        .get('/api/articles/apple/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });

    test('Return status code 404 if article_id is valid but no comments have that given article_id', () => {
      return request(app)
        .get('/api/articles/8/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });

  describe('POST', () => {
    test('Return status code 201 with the new comment', () => {
      const newComment = {
        username: 'butter_bridge',
        body: 'an interesting story',
      };
      return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            body: 'an interesting story',
            author: 'butter_bridge',
          });
        });
    });

    test('Return status code 400 if article_id is not valid', () => {
      const newComment = {
        username: 'butter_bridge',
        body: 'an interesting story',
      };
      return request(app)
        .post('/api/articles/apple/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });

    test('Return status code 404 if username is not valid', () => {
      const newComment = {
        username: 'notAUser',
        body: 'an interesting story',
      };
      return request(app)
        .post('/api/articles/8/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    test('Returns status code 204', () => {
      return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    test('Return status code 404 with an error message if comment_id exists', () => {
      return request(app)
        .delete('/api/comments/300000')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });
});

describe('/api', () => {
  describe('GET', () => {
    test('Return status code 200 and read conetents of endpoints.json', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
        });
    });
  });
});

describe('/api/users', () => {
  describe('GET', () => {
    test('Return status code 200 with an array of objects containing the username of each user', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
            });
          });
        });
    });
  });
});

describe('/api/users/:username', () => {
  describe('GET', () => {
    test('Return status code 200 with an array of objects containing the username of each user', () => {
      return request(app)
        .get('/api/users/butter_bridge')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          expect(body.user).toMatchObject({
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          });
        });
    });

    test('Return status code 404 if username is not valid', () => {
      return request(app)
        .get('/api/users/notAValidUserName')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('PATCH', () => {
    test('Return status code 201, increment votes by 1 and return object', () => {
      const increaseVotes = { inc_votes: 1 };
      return request(app)
        .patch('/api/comments/1')
        .send(increaseVotes)
        .expect(201)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          expect(body.comment).toEqual({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 17,
            author: 'butter_bridge',
            article_id: 9,
            comment_id: 1,
            created_at: '2020-04-06T12:17:00.000Z',
          });
        });
    });

    test('Return status code 201, decrement votes by 1 and return object', () => {
      const decreaseVotes = { inc_votes: -1 };
      return request(app)
        .patch('/api/comments/1')
        .send(decreaseVotes)
        .expect(201)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
          expect(body.comment).toEqual({
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 15,
            author: 'butter_bridge',
            article_id: 9,
            comment_id: 1,
            created_at: '2020-04-06T12:17:00.000Z',
          });
        });
    });

    test('Return status code 404 if comment is not valid', () => {
      const increaseVotes = { inc_votes: 1 };
      return request(app)
        .patch('/api/comments/90000')
        .send(increaseVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });
});
