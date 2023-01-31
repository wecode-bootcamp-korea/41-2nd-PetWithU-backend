// tests/user.test.js

// npm i --save-dev supertest
// supertest의 request를 활용하여 app에 테스트용 request를 보냅니다.
const request = require("supertest");

// supertest의 request에 app을 담아 활용하기 위해 createApp 함수를 불러옵니다.
const { createApp } = require("../app");
// DB와의 커넥션을 위해 DataSource 객체를 불러옵니다.
const { AppDataSource } = require("../src/models/data-source");

describe("Sign Up", () => {
  let app;

  beforeAll(async () => {
    // 모든 테스트가 시작하기 전(beforeAll)에 app을 만들고, DataSource를 이니셜라이징 합니다.
    app = createApp();
    // await AppDataSource.initialize();
  });

  afterAll(async () => {
    // 테스트 데이터베이스의 불필요한 데이터를 전부 지워줍니다.
    await AppDataSource.query(`SET foreign_key_checks = 0;`);
    await AppDataSource.query(`TRUNCATE users`);
    await AppDataSource.query(`SET foreign_key_checks = 1;`);

    // 모든 테스트가 끝나게 되면(afterAll) DB 커넥션을 끊어줍니다.
    await AppDataSource.destroy();
  });

  // 다음과 같이 본인이 작성한 코드에 맞춰 다양한 케이스를 모두 테스트해야 합니다.
  // 그래야 의도에 맞게 코드가 잘 작성되었는지 테스트 단계에서부터 확인할 수 있습니다!

  // 1. 이메일 주소 유효성 검증
  test("FAILED: invalid email", async () => {
    // supertest의 request를 활용하여 app에 테스트용 request를 보냅니다.
    await request(app)
      .post("/users/signup") // HTTP Method, 엔드포인트 주소를 작성합니다.
      .send({
        email: "wrongEmail",
        password: "password001@",
        username: "testName",
        mobile: "testMobile",
      }) // body를 작성합니다.
      .expect(400) // expect()로 예상되는 statusCode, response를 넣어 테스트할 수 있습니다.
      .expect({ message: "invalid email!" });
  });

  // 2. 유저 생성 여부 검증
  test("SUCCESS: created user", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        email: "wecode002@gmail.com",
        password: "password001@",
        username: "testName",
        mobile: "testMobile",
      })
      .expect(201);
  });

  // 3. 메일 중복 여부 검증
  test("FAILED: duplicated email", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        email: "wecode002@gmail.com",
        password: "password001@",
        username: "testName",
        mobile: "testMobile",
      })
      .expect(409)
      .expect({ message: "ALREADY_SIGNED_UP" });
  });
});
