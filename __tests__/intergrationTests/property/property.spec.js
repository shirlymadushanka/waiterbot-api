process.env.NODE_ENV = "test";

const request = require('supertest');
const { http } = require('../../../app');

describe('Property module', () => {

    it('non-administrative users should not be able to create properties', async (done) => {
        payload = {
            owner: null,
            name: "fake name",
            description: "fake desc",
            address: "fake address",
            location: {
                type: "Point",
                coordinates: [
                    -127.5,
                    30.7
                ]
            }
        }
        const response = await request(http)
            .post("/api/properties")
            .send(payload);
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        done();
    });

});