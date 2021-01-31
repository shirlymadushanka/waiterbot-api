const filterID = require('../../../api/middlewares/filterID');
const interceptor = require('../../../__mocks__/interceptor');
const ObjectId = require('mongodb').ObjectID;

describe("ID filter middleware testing", () => {
    it("should fail if request params are not valid", () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        
        req.params = {
            propId : "invalid id"
        }

        filterID(req,res,next);
        expect(next).toBeCalledWith(new Error("Invaid ID!"));

    });

    it("should pass if request params are valid", () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        
        req.params = {
            propId : ObjectId().toString()
        }

        filterID(req,res,next);
        expect(next).toBeCalledWith();

    });
});
