const dotenv = require("dotenv");
const request = require("supertest");
const { appDataSource } = require("../src/models/data-source");
const { createApp } = require("../app");
const axios = require("axios");
dotenv.config();

jest.mock("axios");

describe("social-login", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    // await appDataSource.initialize();
  });
  afterAll(async () => {
    await appDataSource.query(`SET foreign_key_checks = 0`);
    await appDataSource.query(`TRUNCATE users`);
    await appDataSource.query(`SET foreign_key_checks = 1`);
    await appDataSource.destroy();
  });

  test("FAILED: NEED_ACCESS_TOKEN", async () => {
    await request(app)
      .post("/users/kakaologin")
      .expect(400)
      .expect({ message: "NEED_ACCESS_TOKEN" });
  });

  test("SUCCESS: BODY_WITH_TOKEN", async () => {
    axios.get = jest.fn().mockReturnValue({
      data: {
        id: 12124124,
        properties: {
          profile_image: "skldjkalsdjkladjsk",
          nickname: "hihihi",
        },
        kakao_account: {
          email: "asdadsasd@sadasdasds",
        },
      },
    });
    await request(app)
      .post("/users/kakaologin")
      .set("value", "test")
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty("jwtToken");
      });
  });
});
