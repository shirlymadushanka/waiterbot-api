const checkRole = require('../../../api/middlewares/checkRole');
const interceptor = require('../../../__mocks__/interceptor');

describe('CheckRole middleware testing', () => {
    it("should failed if request user is not defined",() => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        
        checkRole(["admin"])(req, res, next);
        const expected = new Error("Unauthorized. You don't have access to this resource.");
        
        expect(next).toHaveBeenCalledWith(expected);
    });

    it("should failed if user role is not in accepted roles",() => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.user = {
            role : "owner"
        }
        checkRole(["admin"])(req, res, next);
        const expected = new Error("Unauthorized. You don't have access to this resource.");
        
        expect(next).toHaveBeenCalledWith(expected);
    });

    it("should success if user role is in accepted roles",() => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.user = {
            role : "owner"
        }
        checkRole(["admin","owner"])(req, res, next);
        
        expect(next).toHaveBeenCalledWith();
    });
});
