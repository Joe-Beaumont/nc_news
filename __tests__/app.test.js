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

describe.only("GET /api/topics", () => {
  test("200: Repsonds with a list of all topics", () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({ body }) => {
      const { topics } = body
      topics.forEach((element) => {
        expect(typeof element.slug).toBe("string")
        expect(typeof element.description).toBe("string")
      })
    })
  });
});