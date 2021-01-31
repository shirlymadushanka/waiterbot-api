const mongoose = require('mongoose');
const interceptor = require('../../../__mocks__/interceptor');
const userSeeder = require('../../../__seedr__/user.seeder');
const propertySeeder = require('../../../__seedr__/property.seeder');

const checkProperty = require('../../../api/middlewares/checkProperty');


let owner, operator, property, admin;
beforeAll((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB",
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
        async () => {
            admin = await userSeeder.seedAdmin();
            owner = await userSeeder.seedOwner();
            property = await propertySeeder.seedProperty({ owner: owner._id });
            operator = await userSeeder.seedOperator({ work_on: property._id });
            done();
        });
});

describe("Check property middleware testing", () => {

    it('should failed when property id is undefined', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();

        await checkProperty(req, res, next);

        expect(next).toBeCalled();
        expect(next).toBeCalledWith(new Error("Property not found!"));
    });

    it('should failed when property id is not valid', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.params.propId = "some_invalid_id";
        await checkProperty(req, res, next);

        expect(next).toBeCalled();
        expect(next).toBeCalledWith(new Error("Property not found!"));
    });

    it('should success when property is accessed by its owner', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.user = {
            user_id: owner._id,
            role: "owner"
        }
        req.params.propId = property._id.toString();
        await checkProperty(req, res, next);

        expect(next).toBeCalledWith();
    });

    it('should success when property is accessed by working operator', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.user = {
            user_id: operator._id,
            role: "operator"
        }
        req.params.propId = property._id.toString();
        await checkProperty(req, res, next);

        expect(next).toBeCalledWith();
    });
})