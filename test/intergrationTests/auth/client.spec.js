process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../../app.js');
const conn = require('../../../db/index.js')

describe('POST /api/auth/client_register', () => {

  it('first_name required case passed.', (done) => {
    request(app).post('/api/auth/client_register')
      .send({ last_name: 'fsdfsfsdf', password: "@fjsklfD2", mobile: "0717726160" })
      .then((res) => {
        const body = res.body;
        expect(body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });

  it('last_name required case passed.', (done) => {
    request(app).post('/api/auth/client_register')
      .send({ last_name: 'fsdfsfsdf', password: "@fjsklfD2", mobile: "0717726160" })
      .then((res) => {
        const body = res.body;
        expect(body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });


  it('mobile required case passed.', (done) => {
    request(app).post('/api/auth/client_register')
      .send({ first_name: 'sfdsfsdf', last_name: 'fsdfsfsdf', password: "@fjsklfD2" })
      .then((res) => {
        const body = res.body;
        expect(body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });

  it('password required case passed.', (done) => {
    request(app).post('/api/auth/client_register')
      .send({ first_name: 'sfdsfsdf', last_name: 'fsdfsfsdf', mobile: "0717726160" })
      .then((res) => {
        const body = res.body;
        expect(body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });

  it('Client registration passed.', (done) => {
    request(app).post('/api/auth/client_register')
      .send({ first_name: 'sfdsfsdf', last_name: 'fsdfsfsdf', password: "@fjsklfD2", mobile: "0717726160" })
      .then((res) => {
        expect(res.body.success).to.equal(true);
        expect(res.body.data.first_name).to.equal('sfdsfsdf');
        done();
      })
      .catch((err) => done(err));
  });

  it('register with exiting mobile case passed.', (done) => {
    request(app).post('/api/auth/client_register')
      .send({ first_name: 'sfdsfsdf', last_name: 'fsdfsfsdf', password: "@fjsklfD2", mobile: "0717726160" })
      .then((res) => {
        expect(res.body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });
});

describe('POST /api/auth/client_login', () => {

  it('mobile required case passed.', (done) => {
    request(app).post('/api/auth/client_login')
      .send({ password: "@fjsklfD2" })
      .then((res) => {
        const body = res.body;
        expect(body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });

  it('password required case passed.', (done) => {
    request(app).post('/api/auth/client_login')
      .send({ mobile: "+94717726169" })
      .then((res) => {
        const body = res.body;
        expect(body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });

  it('Client login passed.', (done) => {
    request(app).post('/api/auth/client_login').send({ password: "@fjsklfD2", mobile: "0717726160" })
      .then((res) => {
        expect(res.body.success).to.equal(true);
        expect(res.body.role).to.equal('client');
        expect(res.body).to.have.property('token')
        done();
      })
      .catch((err) => done(err));
  });

  it('Invalid credintials case passed.', (done) => {
    request(app).post('/api/auth/client_login')
      .send({ password: "@fjsklfD2fds", mobile: "+94717726169" })
      .then((res) => {
        expect(res.body.success).to.equal(false);
        done();
      })
      .catch((err) => done(err));
  });
})