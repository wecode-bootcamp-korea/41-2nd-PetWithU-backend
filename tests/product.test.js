const dotenv = require("dotenv");
const request = require("supertest");
const { appDataSource } = require("../src/models/data-source");
const { createApp } = require("../app");
const axios = require("axios");
dotenv.config();

describe("SEARCH", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await appDataSource.initialize();
  });
  afterAll(async () => {
    await appDataSource.destroy();
  });

  test("SUCCESS: SEARCH", async () => {
    await request(app)
      .get(encodeURI(`/products/search?keyword=강아지"`))
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty([productList]);
      });
  });
});
