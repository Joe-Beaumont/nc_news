const endpointsJson = require("../endpoints.json");
const data = require("../db/data/test-data")
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");
require("jest-sorted")

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with a list of all topics", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body
        expect(topics.length).toBe(3)
        topics.forEach((element) => {
          expect(typeof element.slug).toBe("string")
          expect(typeof element.description).toBe("string")
        })
      })
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with requested article", () => {
    return request(app)
      .get('/api/articles/2')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.length).toEqual(1);
        expect(article[0].title).toEqual("Sony Vaio; or, The Laptop");
        expect(article[0].topic).toEqual("mitch");
        expect(article[0].author).toEqual("icellusedkars");
        expect(article[0].body).toEqual("Call me Mitchell. Some years ago..");
        expect(article[0].votes).toEqual(0);
        expect(article[0].created_at).toEqual("2020-10-16T05:03:00.000Z")
        expect(article[0].article_img_url).toEqual("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      })
  })
  test("responds with 404 if article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toEqual("No articles with that id")
      })
  })
  test("200: Article contains comment count", () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].comment_count).toEqual(2);
      })
  })
});

describe("GET /api/articles", () => {
  test("responds with all articles sorted by created_at in descending order as default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(13)
        expect(articles).toBeSortedBy("created_at", { descending: true })
        articles.forEach((article) => {
          expect(typeof article.article_id).toEqual("number");
          expect(typeof article.title).toEqual("string");
          expect(typeof article.topic).toEqual("string");
          expect(typeof article.author).toEqual("string");
          expect(typeof article.created_at).toEqual("string");
          expect(typeof article.votes).toEqual("number");
          expect(typeof article.article_img_url).toEqual("string");
          expect(typeof article.comment_count).toEqual("number")
        })
      })
  })
  test("Responds with all articles, sorted by given column name and in asc or desc as requested", () => {
    return request(app)
      .get("/api/articles?sort=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(13)
        expect(articles).toBeSortedBy("votes", { descending: false })
        articles.forEach((article) => {
          expect(typeof article.article_id).toEqual("number");
          expect(typeof article.title).toEqual("string");
          expect(typeof article.topic).toEqual("string");
          expect(typeof article.author).toEqual("string");
          expect(typeof article.created_at).toEqual("string");
          expect(typeof article.votes).toEqual("number");
          expect(typeof article.article_img_url).toEqual("string");
          expect(typeof article.comment_count).toEqual("number")
        })
      })
  })
  test("Responds 400 if sorted_by is invalid", () => {
    return request(app)
      .get("/api/articles?sort=notAColumn&order=asc")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Invalid query")
      })
  })
  test("Responds 400 if order is invalid", () => {
    return request(app)
      .get("/api/articles?sort=votes&order=notADirection")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Invalid query")
      })
  })
  test("responds with article filtered by specified topic", () => {
    return request(app)
      .get("/api/articles?filter=topic&by=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles.length).toBe(1)
        expect(articles).toBeSortedBy("created_at", { descending: true })
        articles.forEach((article) => {
          expect(typeof article.article_id).toEqual("number");
          expect(typeof article.title).toEqual("string");
          expect(typeof article.topic).toEqual("string");
          expect(typeof article.author).toEqual("string");
          expect(typeof article.created_at).toEqual("string");
          expect(typeof article.votes).toEqual("number");
          expect(typeof article.article_img_url).toEqual("string");
          expect(typeof article.comment_count).toEqual("number")
        })
      })
  })
  test("Responds 400 if filter is invalid", () => {
    return request(app)
      .get("/api/articles?filter=notacolumn&by=cats")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Invalid query")
      })
  })
  test("Responds 404 if topic is invalid", () => {
    return request(app)
      .get("/api/articles?filter=topic&by=notATopic")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("No articles found")
      })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("Responds with all comments under the given article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        expect(comments.length).toBe(2)
        expect(comments).toBeSortedBy("created_at", { descending: false })
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number")
          expect(typeof comment.body).toBe("string"),
            expect(typeof comment.votes).toBe("number"),
            expect(typeof comment.author).toBe("string"),
            expect(typeof comment.created_at).toBe("string"),
            expect(comment.article_id).toBe(3)
        })
      })
  })

  test("Responds with a 404 if either the article doesn't exist or there are no comments associated", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("No comments found")
      })
  })
  test("returns 400 if article_id is not valid", () => {
    return request(app)
      .get("/api/articles/notAnID/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Invalid id")
      })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("Updates votes on article by amount provided in object", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 3 })
      .expect(201)
      .then(({ body }) => {
        const { votes } = body.updatedArticle
        expect(votes).toBe(3)
      })
  })
  test("responds with 400 if votes is not a number", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "3" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toEqual("Votes provided not a number")
      })
  })
  test("responds with 404 if id provided is valid but doesn't exist", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 3 })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("No articles with that id")
      })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("adds comment to specified article", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: 'butter_bridge',
        body: 'test-body'
      })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body
        expect(comment).toBe('test-body')
      })
  })
  test("Responds with a 400 if the user doesn't exist", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({
        username: 'fake-user',
        body: 'test-body'
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('Incorrect user')
      })
  })
  test("Responds with a 404 if the article doesn't exist", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({
        username: 'butter_bridge',
        body: 'test-body'
      })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('No articles with that id')
      })
  })
  test("returns 400 if article_id is not valid", () => {
    return request(app)
      .post("/api/articles/NotAnID/comments")
      .send({
        username: 'butter_bridge',
        body: 'test-body'
      })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe('Invalid id')
      })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("deletes given comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
  })
  test("returns 404 if comment_id valid but doesn't exist", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("No comment found")
      })
  })
  test("returns 400 if comment_id not valid", () => {
    return request(app)
      .delete("/api/comments/notAnID")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Invalid id")
      })
  })
})

describe("GET /api/users", () => {
  test("Responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body
        expect(users.length).toBe(4)
        users.forEach((user) => {
          expect(typeof user.username).toBe("string")
          expect(typeof user.name).toBe("string"),
            expect(typeof user.avatar_url).toBe("string")
        })
      })
  })
})

describe("General Errors", () => {
  test("404: Responds with a 404 when presented a non-existant endpoint", () => {
    return request(app)
      .get('/api/nonexistant')
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Page does not exist")
      })
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("Updates votes on comment by amount provided in object", () => {
    return request(app)
      .patch("/api/comments/5")
      .send({ inc_votes: 3 })
      .expect(201)
      .then(({ body }) => {
        const { votes } = body.updatedComment
        expect(votes).toBe(3)
      })
    })
    test("responds with 400 if votes is not a number", () => {
      return request(app)
      .patch("/api/comments/5")
      .send({ inc_votes: "3" })
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toEqual("Votes provided not a number")
      })
  })
  test("responds with 404 if id provided is valid but doesn't exist", () => {
    return request(app)
      .patch("/api/comments/999")
      .send({ inc_votes: 3 })
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("No comments with that id")
      })
  });
});

describe("GET /api/comments/:comment_id", () => {
  test("Responds with the given comment", () => {
    return request(app)
      .get("/api/comments/5")
      .expect(200)
      .then(({ body }) => {
        const { comment } = body
          expect(comment.comment_id).toBe(5)
          expect(typeof comment.body).toBe("string"),
            expect(typeof comment.votes).toBe("number"),
            expect(typeof comment.author).toBe("string"),
            expect(typeof comment.created_at).toBe("string")
      })
  })
      
      test("Responds with a 404 if the comment doesn't exist", () => {
        return request(app)
        .get("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body
          expect(msg).toBe("No comments found")
        })
      })
      test("returns 400 if comment_id is not valid", () => {
        return request(app)
        .get("/api/comments/notAnID/")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body
          expect(msg).toBe("Invalid id")
        })
      })
})
      