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
        .then((res) => {
          expect(typeof res.body).toBe('object');
          expect(res.body).hasOwnProperty('topics');
          res.body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
    test('Return status code 404 when ', () => {});
  });
});
