const request = require('supertest');
const app = require('../../../app');
const { MongoMemServer } = require('../../../db');


describe('Property module',() => {
    const memServer = new MongoMemServer();
    beforeAll(() => memServer.start());

    afterAll(() => memServer.stop());

    // afterEach(() => memServer.clean());

    it('should able to create new property to an owner', () => {
        expect(true).toBe(true);
    })

});