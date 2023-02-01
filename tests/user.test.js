// tests/user.test.js

// npm i --save-dev supertest
// supertest의 request를 활용하여 app에 테스트용 request를 보냅니다.
const request = require("supertest");

// supertest의 request에 app을 담아 활용하기 위해 createApp 함수를 불러옵니다.
const { createApp } = require("../app");
// DB와의 커넥션을 위해 DataSource 객체를 불러옵니다.
const { appDataSource } = require("../src/models/data-source");

describe("Sign Up", () => {
  let app;

  beforeAll(async () => {
    // 모든 테스트가 시작하기 전(beforeAll)에 app을 만들고, DataSource를 이니셜라이징 합니다.
    app = createApp();
    await appDataSource.initialize();
    await appDataSource.query(`SET foreign_key_checks = 0`);
  });

  afterAll(async () => {
    // 테스트 데이터베이스의 불필요한 데이터를 전부 지워줍니다.
    await appDataSource.query(`SET foreign_key_checks = 0;`);
    await appDataSource.query(`TRUNCATE users`);
    await appDataSource.query(`SET foreign_key_checks = 1;`);

    // 모든 테스트가 끝나게 되면(afterAll) DB 커넥션을 끊어줍니다.
    await appDataSource.destroy();
  });

  // 1. FE로부터 kakao token 을 잘 전달받았는지 확인
  test("SUCCESS: NEED_KAKAO_TOKEN", async () => {
    // supertest의 request를 활용하여 app에 테스트용 request를 보냅니다.
    await request(app)
      .post("/users/kakaologin") // HTTP Method, 엔드포인트 주소를 작성합니다.
      .headers({
        value: "L0A8Jag94Mg7TgoMLSf7ru3mNg0u6T_ychjo5SVoCinJYAAAAYYLR281",
      })
      .expect(400) // expect()로 예상되는 statusCode, response를 넣어 테스트할 수 있습니다.
      .expect({ message: "NEED_KAKAO_TOKEN" });
  });

  // 2. token 을 이용해 카카오로부터 사용자 정보를 잘 받아오는지 확인
  test("FAILED: NEED_KAKAO_USER_INFO", async () => {
    axios.get = jest.fn().mockReturnValue({
      data: {
        token_type: "bearer",
      },
    });

    await request(app)
      .post("/users/kakaologin")
      .headers({ authorization: "testKakaoToken" })
      .expect(400)
      .expect({ message: "NEED_KAKAO_USER_INFO" });
  });

  // 3. 유저 생성 여부 검증
  test("SUCCESS: KAKAO_LOGIN", async () => {
    axios.get = jest.fn().mockReturnValue({
      data: {
        id: 123456789,
        properties: {
          nickname: "testNickname",
        },
        kakao_account: {
          email: "test@email.com",
        },
      },
    });

    await request(app)
      .post("/users/kakaologin")
      .query({ code: "testAuthCode3" })
      .set({
        Authorization: "Bearer testKakaoToken",
      })
      .expect(200)
      .then((res) => {
        expect(res.body.hasOwnProperty("jwtToken")).toBe(true);
      });
  });
});
