const mongoose = require('mongoose');
const interceptor = require('../../__mocks__/interceptor');
const userSeeder = require('../../__seedr__/user.seeder');
const propertySeeder = require('../../__seedr__/property.seeder');
const itemSeeder = require('../../__seedr__/item.seeder');

const checkItem = require('../../api/middlewares/checkItem');


let owner, operator, property, admin, item;
beforeAll((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB",
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
        async () => {
            admin = await userSeeder.seedAdmin();
            owner = await userSeeder.seedOwner();
            property = await propertySeeder.seedProperty({ owner: owner._id });
            operator = await userSeeder.seedOperator({ work_on: property._id });
            item = await itemSeeder.seedItem({ property: property._id });
            done();
        });
});

describe("Check item middleware testing", () => {

    it('should failed when item id is undefined', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();

        await checkItem(req, res, next);

        expect(next).toBeCalledWith(new Error("Item not found!"));
    });

    it('should failed when item id is not valid', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.params.itemId = "some_invalid_id";
        await checkItem(req, res, next);

        expect(next).toBeCalledWith(new Error("Item not found!"));
    });

    it('should success when item is accessed by its owner', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.user = {
            user_id: owner._id,
            role: "owner"
        }
        req.params.itemId = item._id.toString();
        await checkItem(req, res, next);

        expect(next).toBeCalledWith();
    });

    it('should success when item is accessed by working operator', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.user = {
            user_id: operator._id,
            role: "operator"
        }
        req.params.itemId = item._id.toString();
        await checkItem(req, res, next);

        expect(next).toBeCalledWith();
    });
})