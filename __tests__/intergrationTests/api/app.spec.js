process.env.NODE_ENV = "test";
process.env.DB = "mongodb://localhost:27017/waiterbot-test"

const request = require('supertest');
const { http }  = require('../../../app');


describe('Api up and running', () => {
  it('/api should respond with 200', async (done) => {
    const response = await request(http)
      .get('/api');
    expect(response.status).toBe(200);
    done();
  });

  it('Should respond with 404 with unknown routes', async (done) => {
    const response = await request(http)
      .get('/api/unknown').expect(404);
      done();
  });

});