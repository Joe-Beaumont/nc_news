const endpointsJson = require("../endpoints.json");
const data = require("../db/data/test-data")
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const app = require("../app");


beforeEach(() => {
  return seed(data);
})
afterAll(() => {
  return db.end()
})

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
  test("200: Repsonds with a list of all topics", () => {
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
    .then(({body}) => {
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
      expect(msg).toEqual("Not a valid id")
    })
  })
});

describe("Errors", () => {
  test("404: Repsonds with a 404 when presented a non-existant endpoint", () => {
    return request(app)
    .get('/api/nonexistant')
    .expect(404)
    .then(({ body }) => {
      const { msg } = body
      expect(msg).toBe("Page does not exist")
    })
  });
});