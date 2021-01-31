process.env.NODE_ENV = "test";

const request = require('supertest');
const { http } = require('../../../app');
const User = require('../../../api/models/UserBase');

const adminUserPayload = {
  "first_name": "john",
  "last_name": "admin",
  "mobile": "0717726169",
  "password": "@A12345678b"
};

const ownerUserPayload = {
  "first_name": "john",
  "last_name": "owner",
  "mobile": "0717726168",
  "password": "@A12345678b"
};


const adminLoginEndPoint = "/api/auth/admin_login";
const adminRegisterEndPoint = "/api/auth/admin_register";
const adminProtectedRouteEndPoint = "/api/admins/profile";

const ownerLoginEndPoint = "/api/auth/owner_login";
const ownerRegisterEndPoint = "/api/auth/owner_register";
const ownerProtectedRouteEndPoint = "/api/owners/profile";

let adminToken;

describe(`Auth module`, () => {

  it(`should be able to create admin user`, async (done) => {

    const response = await request(http)
      .post(adminRegisterEndPoint)
      .send(adminUserPayload);

    expect(response.status).toBe(201);
    let createdUser = await User.find({ mobile: adminUserPayload.mobile });
    expect(createdUser.length).toBe(1);
    expect(createdUser[0].role).toEqual("admin");
    done();
  });

  it('should not be able to create a user with same mobile number', async (done) => {
    const response = await request(http)
      .post(adminRegisterEndPoint)
      .send(adminUserPayload);

    expect(response.status).toBe(409);
    let createdUser = await User.find({ mobile: adminUserPayload.mobile });
    // user count with still should be 1
    expect(createdUser.length).toBe(1);
    done();
  });

  it(`should handle inputs on user register`, async (done) => {
    let { first_name, last_name, password } = adminUserPayload;

    const response = await request(http)
      .post(adminRegisterEndPoint)
      .send({
        first_name,
        last_name,
        password
      });
    expect(response.status).toBe(422);
    done();
  });

  it(`admin should be able to login`, async (done) => {
    const { password, mobile } = adminUserPayload;
    const response = await request(http)
      .post(adminLoginEndPoint)
      .send({
        password,
        mobile
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    done();
    adminToken = response.body.token;
  })

  it(`public user should not be access admin protected routes`, async (done) => {
    const response = await request(http)
      .get(adminProtectedRouteEndPoint);
    expect(response.status).not.toBe(200);
    done();
  });

  it(`authorized user should be access protected routes`, async (done) => {
    var bearerToken = `Bearer ${adminToken}`;
    const response = await request(http)
      .get(adminProtectedRouteEndPoint)
      .set({ "authorization": bearerToken });
    expect(response.status).toBe(200);
    done();
  });

  it(`admin should be able to create owners`, async (done) => {
    var bearerToken = `Bearer ${adminToken}`;
    const response = await request(http)
      .post(ownerRegisterEndPoint)
      .set({ "authorization": bearerToken })
      .send(ownerUserPayload);

    expect(response.status).toBe(201);
    let createdUser = await User.find({ mobile: ownerUserPayload.mobile });
    expect(createdUser.length).toBe(1);
    expect(createdUser[0].role).toEqual("owner");
    done();
  });

});

