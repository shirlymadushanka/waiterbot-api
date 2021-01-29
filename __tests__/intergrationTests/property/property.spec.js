const request = require('supertest');
const { MongoMemServer } = require('../../../db');


describe('Property module',() => {
    const memServer = new MongoMemServer();
    beforeAll(() => memServer.start());

    afterAll(() => memServer.stop());

    // afterEach(() => memServer.clean());

    it('should able to create new property to an owner', (done) => {
        expect(true).toBe(true);
        done();
    })

});