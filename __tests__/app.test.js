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