const createHttpError = require('http-errors');
const mongoose = require('mongoose');
const checkAuth = require('../../../api/middlewares/checkAuth');
const interceptor = require('../../../__mocks__/interceptor');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../../../api/config');

const Admin = require('../../../api/models/Admin');

beforeAll((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB",
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, },
        () => {
            done();
        });
});




describe("CheckAuth middleware testing", () => {
    it('should fail if there is no authorization header', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();

        const expected = createHttpError.Unauthorized("Unauthorized! Please login to proceed.");
        await checkAuth(req, res, next);
        expect(next).toHaveBeenCalledWith(expected);
    });

    it('should fail if token is invalid', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        req.headers.authorization = `Bearer this_is_invalid_token`

        const expected = new jwt.JsonWebTokenError("jwt malformed");
        await checkAuth(req, res, next);
        expect(next).toHaveBeenCalledWith(expected);
    });

    it('should fail if token is valid & user not exists', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        let token = jwt.sign({
                user_id: "test-id",
                role: "admin"
            },
            SECRET,
            { expiresIn: '1d' }
        );

        req.headers.authorization = `Bearer ${token}`

        await checkAuth(req, res, next);
        expect(next).toHaveBeenCalledWith(createHttpError.Unauthorized("Unauthorized! Please login to proceed."));
        expect(req.user).toBeUndefined();
    });

    it('should success if token is valid & user exists', async () => {
        const req = interceptor.mockRequest();
        const res = interceptor.mockResponse();
        const next = interceptor.mockNext();
        const user = new Admin({
            first_name : "test_first",
            last_name : "test_last",
            role: "admin",
            password : "hashed",
            mobile : "test mobile"
        });
        await user.save();
        let token = jwt.sign({
                user_id: user._id,
                role: "admin"
            },
            SECRET,
            { expiresIn: '1d' }
        );

        req.headers.authorization = `Bearer ${token}`

        await checkAuth(req, res, next);
        expect(req.user).toBeDefined();
        expect(next).toHaveBeenCalledWith();
    });
})