const request = require('supertest');
const { app } = require('../../../app');
const { MongoMemServer } = require('../../../db');
const User = require('../../../api/models/UserBase');

const payload = {
  "first_name": "john",
  "last_name": "snow",
  "mobile": "0717726169",
  "password": "@A12345678b"
};

// change this for your role
const loginEndPoint = "/api/auth/admin_login";
const registerEndPoint = "/api/auth/admin_register";
const role = "admin";
const roleProtectedRouteEndPoint = "/api/admins/profile";
let token;

describe('Admin auth module', () => {
  const memServer = new MongoMemServer();
  beforeAll(() => memServer.start());

  afterAll(() => memServer.stop());

  // afterEach(() => memServer.clean());

  it('should be able to create a user', async (done) => {

    const response = await request(app)
      .post(registerEndPoint)
      .send(payload);

    expect(response.status).toBe(201);
    let createdUser = await User.find({ mobile: payload.mobile });
    expect(createdUser.length).toBe(1);
    expect(createdUser[0].role).toEqual(role);
    done();
  });

  it('should not be able to create a user with same mobile number', async (done) => {
    const response = await request(app)
      .post(registerEndPoint)
      .send(payload);

    expect(response.status).toBe(409);
    let createdUser = await User.find({ mobile: payload.mobile });
    // user count with still should be 1
    expect(createdUser.length).toBe(1);
    done();
  });

  it('should handle inputs on user register', async (done) => {
    let { first_name, last_name, password } = payload;

    const response = await request(app)
      .post(registerEndPoint)
      .send({
        first_name,
        last_name,
        password
      });
    expect(response.status).toBe(422);
    done();
  });

  it('user should be able to login', async (done) => {
    const { password, mobile } = payload;
    const response = await request(app)
      .post(loginEndPoint)
      .send({
        password,
        mobile
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    done();
    token = response.body.token;
  })

  it('public user should not be access protected routes', async (done) => {
    const response = await request(app)
      .get(roleProtectedRouteEndPoint);
    expect(response.status).not.toBe(200);
    done();
  });

  it('authorized user should be access protected routes', async (done) => {
    var bearerToken = `Bearer ${token}`;
    const response = await request(app)
      .get(roleProtectedRouteEndPoint)
      .set({ "authorization": bearerToken });
    expect(response.status).toBe(200);
    done();
  });

});