const request = require('supertest');
const app = require('../../../app');


describe('Api up and running', () => {
  it('/api should respond with 200', async () => {
    
    const response = await request(app)
      .get('/api');
    expect(response.status).toBe(200);
  });

  it('Should respond with 404 with unknown routes', async () => {
    const response = await request(app)
      .get('/api/unknown');
    expect(response.status).toBe(404);
  });

});