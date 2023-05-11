const db = require("../db/connection.js");
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET", () => {
    test("Return status code 200 with the conetents of the endpoints.json file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty("GET /api");
          expect(body).toHaveProperty("GET /api/topics");
          expect(body).toHaveProperty("GET /api/articles");
          expect(body).toHaveProperty("GET /api/articles/:article_id");
          expect(body).toHaveProperty("PATCH /api/articles/:article_id");
          expect(body).toHaveProperty("GET /api/articles/:article_id/comments");
          expect(body).toHaveProperty(
            "POST /api/articles/:article_id/comments"
          );
          expect(body).toHaveProperty("DELETE /api/comments/:comment_id");
          expect(body).toHaveProperty("GET /api/users");
          expect(body).toHaveProperty("POST /api/users");
          expect(body).toHaveProperty("GET /api/users/:username");
        });
    });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("Return status code 200 and an array of all the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBeGreaterThan(0);
          body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });

  describe("POST", () => {
    test("Return status code 201 and the created topic", () => {
      const newTopic = {
        slug: "Movies",
        description: "Best Movies",
      };

      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).toEqual(newTopic);
        });
    });

    test("Return status code 400 when there is a missing property in the given body", () => {
      const newTopic = {
        slug: "Movies",
      };

      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request");
        });
    });

    test("Return status code 400 when given a topic slug that already exists", () => {
      const newTopic = {
        slug: "cats",
        description: "...",
      };

      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("Return status code 200 and an array of articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBeGreaterThan(0);
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

    test("Return status code 200 and an array of articles sorted by date by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });

    test("Return status code 200 and an array of articles sorted by article_id", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("article_id", {
            descending: true,
          });
        });
    });

    test("Return status code 200 and an array of articles ordered by desc as default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ descending: true });
        });
    });

    test("Return status code 200 and an array of articles ordered by asc", () => {
      return request(app)
        .get("/api/articles?order_by=ASC")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ ascending: true });
        });
    });

    test("Return status code 200 and return an array of articles by a specific topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).toBeGreaterThan(0);
          body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });

    test("Return status code 400 with a bad request message if sorted by an invalid column name", () => {
      return request(app)
        .get("/api/articles?sort_by=NotAColumn")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Return status code 400 with bad request if order by is invalid", () => {
      return request(app)
        .get("/api/articles?order_by=ASCSS")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Return status code 404 with not found if topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=skadnsajkdbasbdaslbd")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    describe("Pagination", () => {
      test("Return status code 200 and an array of articles limited by 10 by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(10);
          });
      });

      test("Return status code 200 and an array of articles limited by 4", () => {
        return request(app)
          .get("/api/articles?limit=4")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(4);
          });
      });

      test("Return status code 200 and an array of articles with an offset based on the page number and limit", () => {
        return request(app)
          .get("/api/articles?limit=4&p=2")
          .expect(200)
          .then(({ body }) => {
            const firstRequestedArticle = body.articles[0].article_id;

            return request(app)
              .get("/api/articles?limit=4&p=1")
              .expect(200)
              .then(({ body }) => {
                const secondRequestedArticle = body.articles[0].article_id;

                expect(firstRequestedArticle).not.toBe(secondRequestedArticle);
              });
          });
      });

      test("Return status code 400 if limit is invalid", () => {
        return request(app)
          .get("/api/articles?limit=test")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });

      test("Return status code 400 if p is invalid", () => {
        return request(app)
          .get("/api/articles?p=test")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
  });

  describe("POST", () => {
    test("Return status code 201 with the new comment", () => {
      const newArticle = {
        author: "butter_bridge",
        body: "an interesting story",
        title: "an interesting title",
        topic: "mitch",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rocket_League_coverart.jpg/600px-Rocket_League_coverart.jpg",
      };

      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            comment_count: expect.any(String),
            ...newArticle,
          });
        });
    });

    test("Return status code 201 with the new comment, and when not given a article_img_url the default value should be used instead", () => {
      const newArticle = {
        author: "butter_bridge",
        body: "an interesting story",
        title: "an interesting title",
        topic: "mitch",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(201)
        .then(({ body }) => {
          expect(body.article).toMatchObject({
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            comment_count: expect.any(String),
            article_img_url: expect.any(String),
            ...newArticle,
          });
        });
    });

    test("Return status code 400 if a property is missing from the provided body", () => {
      const newArticle = {
        author: "butter_bridge",
        topic: "mitch",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rocket_League_coverart.jpg/600px-Rocket_League_coverart.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Return status code 404 if author does not exist", () => {
      const newArticle = {
        author: "NotAValidAuthor",
        body: "an interesting story",
        title: "an interesting title",
        topic: "mitch",
        article_img_url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Rocket_League_coverart.jpg/600px-Rocket_League_coverart.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(newArticle)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    describe("DELETE", () => {
      test("Returns status code 204 after removing the specified article by its id", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(204)
          .then(() => {
            return request(app)
              .delete("/api/articles/1")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("Not found");
              });
          });
      });

      test("Return status code 404 if the article_id does not exists", () => {
        return request(app)
          .delete("/api/articles/300000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });

      test("Return status code 400 if the article_id is invalid", () => {
        return request(app)
          .delete("/api/articles/apple")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
  });

  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("Return status code 200 and the specified article by its id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toMatchObject({
              article_id: 1,
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

      test("Return status code 404 when given an article_id which is valid but not found", () => {
        return request(app)
          .get("/api/articles/300000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });

      test("Return status code 400 when given an article_id which is invalid", () => {
        return request(app)
          .get("/api/articles/a")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });

    describe("PATCH", () => {
      test("Return status code 200, when given an object with inc_votes and a number to increment the votes of the specified article by its id", () => {
        const increaseVotes = { inc_votes: 10 };
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const initialVoteValue = body.article.votes;

            return request(app)
              .patch("/api/articles/1")
              .send(increaseVotes)
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toMatchObject({
                  article_id: 1,
                  title: expect.any(String),
                  body: expect.any(String),
                  votes: expect.any(Number),
                  author: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                });

                expect(initialVoteValue + 10).toBe(body.article.votes);
              });
          });
      });

      test("Return status code 200 when given an object with inc_votes and a number to decrement votes  of the specified article by its id", () => {
        const decreaseVotes = { inc_votes: -10 };
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const initialVoteValue = body.article.votes;

            return request(app)
              .patch("/api/articles/1")
              .send(decreaseVotes)
              .expect(200)
              .then(({ body }) => {
                expect(body.article).toMatchObject({
                  article_id: 1,
                  title: expect.any(String),
                  body: expect.any(String),
                  votes: expect.any(Number),
                  author: expect.any(String),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                });

                expect(initialVoteValue - 10).toBe(body.article.votes);
              });
          });
      });

      test("Return status code 404 if article_id is valid but not found", () => {
        const increaseVotes = { inc_votes: 10 };

        return request(app)
          .patch("/api/articles/300000")
          .send(increaseVotes)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });

      test("Return status code 400 if article_id is invalid", () => {
        const increaseVotes = { inc_votes: 10 };
        return request(app)
          .patch("/api/articles/a")
          .send(increaseVotes)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });

      test("Return status code 400 if inc_votes is missing", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });

    describe("/api/articles/:article_id/comments", () => {
      describe("GET", () => {
        test("Return status code 200 with an array of comments for the given article id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBeGreaterThan(0);

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

        test("Return status code 200 and an array of comments limited by 10 by default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBe(10);
            });
        });

        test("Return status code 200 and an array of comments limited by 4", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=4")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBe(4);
            });
        });

        test("Return status code 200 and an array of comments with an offset based on the page number and limit", () => {
          return request(app)
            .get("/api/articles/1/comments?limit=4&p=2")
            .expect(200)
            .then(({ body }) => {
              const firstRequestedArticle = body.comments[0].comment_id;

              return request(app)
                .get("/api/articles/1/comments?limit=4&p=1")
                .expect(200)
                .then(({ body }) => {
                  const secondRequestedArticle = body.comments[0].comment_id;

                  expect(firstRequestedArticle).not.toBe(
                    secondRequestedArticle
                  );
                });
            });
        });

        test("Return status code 200 with an empty array if no comments exist for the given article_id", () => {
          return request(app)
            .get("/api/articles/8/comments")
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toEqual([]);
            });
        });

        test("Return status code 404 if article_id is valid but does not exist", () => {
          return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not found");
            });
        });

        test("Return status code 400 if article_id is not valid", () => {
          return request(app)
            .get("/api/articles/apple/comments")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
            });
        });

        describe("Pagination", () => {
          test("Return status code 200 and an array of comments limited by 10 by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).toBe(10);
              });
          });

          test("Return status code 200 and an array of comments limited by 4", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=4")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).toBe(4);
              });
          });

          test("Return status code 200 and an array of comments with an offset based on the page number and limit", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=4&p=2")
              .expect(200)
              .then(({ body }) => {
                const firstRequestedArticle = body.comments[0].comment_id;

                return request(app)
                  .get("/api/articles/1/comments?limit=4&p=1")
                  .expect(200)
                  .then(({ body }) => {
                    const secondRequestedArticle = body.comments[0].comment_id;

                    expect(firstRequestedArticle).not.toBe(
                      secondRequestedArticle
                    );
                  });
              });
          });

          test("Return status code 400 if limit is invalid", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=test")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
              });
          });

          test("Return status code 400 if p is invalid", () => {
            return request(app)
              .get("/api/articles/1/comments?p=test")
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad request");
              });
          });
        });
      });

      describe("POST", () => {
        test("Return status code 201 with the new comment", () => {
          const newComment = {
            username: "butter_bridge",
            body: "an interesting story",
          };
          return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(body.comment).toEqual({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                body: "an interesting story",
                author: "butter_bridge",
              });
            });
        });

        test("Return status code 400 if a property is missing from the provided body", () => {
          const newComment = {
            username: "butter_bridge",
          };
          return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
            });
        });

        test("Return status code 404 if username does not exist", () => {
          const newComment = {
            username: "notAUser",
            body: "an interesting story",
          };
          return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not found");
            });
        });

        test("Return status code 400 if the article id is invalid", () => {
          const newComment = {
            username: "butter_bridge",
            body: "an interesting story",
          };
          return request(app)
            .post("/api/articles/apple/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
            });
        });

        test("Return status code 404 if the article id is valid but does not exist", () => {
          const newComment = {
            username: "butter_bridge",
            body: "an interesting story",
          };
          return request(app)
            .post("/api/articles/999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not found");
            });
        });
      });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    test("Returns status code 204 after removing the specified comment by its id", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return request(app)
            .delete("/api/comments/1")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not found");
            });
        });
    });

    test("Return status code 404 if the comment_id does not exists", () => {
      return request(app)
        .delete("/api/comments/300000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    test("Return status code 400 if the comment_id is invalid", () => {
      return request(app)
        .delete("/api/comments/apple")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });

  describe("PATCH", () => {
    test("Return status code 200 and increment votes by 1 of the speicified comment", () => {
      const increaseVotes = { inc_votes: 1 };

      return request(app)
        .patch("/api/comments/1")
        .send(increaseVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            body: expect.any(String),
            votes: 17,
            author: expect.any(String),
            article_id: expect.any(Number),
            comment_id: 1,
            created_at: expect.any(String),
          });
        });
    });

    test("Return status code 200 and decrement votes by 1 of the speicified comment", () => {
      const decreaseVotes = { inc_votes: -1 };
      return request(app)
        .patch("/api/comments/1")
        .send(decreaseVotes)
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            body: expect.any(String),
            votes: 15,
            author: expect.any(String),
            article_id: expect.any(Number),
            comment_id: 1,
            created_at: expect.any(String),
          });
        });
    });

    test("Return status code 404 if the comment_id is valid but does not exist", () => {
      const increaseVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/90000")
        .send(increaseVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    test("Return status code 400 if the comment_id is invalid", () => {
      const increaseVotes = { inc_votes: 1 };
      return request(app)
        .patch("/api/comments/apple")
        .send(increaseVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Return status code 400 if inc_votes is invalid", () => {
      const increaseVotes = { inc_votes: "apple" };
      return request(app)
        .patch("/api/comments/1")
        .send(increaseVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });

    test("Return status code 400 with error message if inc_votes is missing", () => {
      return request(app)
        .patch("/api/comments/1")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("Return status code 200 with an array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBeGreaterThan(0);

          body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
            });
          });
        });
    });
  });

  describe("POST", () => {
    test("Return status code 201 and the created user", () => {
      const newUser = {
        username: "mkd",
        name: "mohammed",
        avatar_url: "www.example.com/mkd.png",
      };

      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          expect(body.user).toEqual(newUser);
        });
    });

    test("Return status code 400 when there is a missing property in the given body", () => {
      const newUser = {
        username: "mkd",
        avatar_url: "www.example.com/mkd.png",
      };

      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request");
        });
    });

    test("Return status code 400 when given a username that already exists", () => {
      const newUser = {
        username: "butter_bridge",
        name: "butter",
        avatar_url: "www.example.com/butter.png",
      };

      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Bad request");
        });
    });
  });

  describe("/api/users/:username", () => {
    describe("GET", () => {
      test("Return status code 200 with the specified user", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).toMatchObject({
              username: "butter_bridge",
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
      });

      test("Return status code 404 if the user does not exist", () => {
        return request(app)
          .get("/api/users/notAValidUserName")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not found");
          });
      });
    });
  });
});
