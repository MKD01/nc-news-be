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
    test('Return status code 200 and the correct', () => {
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
});
