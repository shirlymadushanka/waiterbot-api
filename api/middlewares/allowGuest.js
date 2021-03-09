const jwt = require("jsonwebtoken");
const { SECRET } = require("../config");

module.exports = async (req, res, next) => {
  try {
    // check if the token is there in header
    if (req.headers.authorization) {
      // extract token from request header.
      const token = req.headers.authorization.split(" ")[1];
      // verify and decode token
      const decodedPayload = jwt.verify(token, SECRET);
      // set request body
      req.user = decodedPayload;
    }
    next();
  } catch (err) {
    next();
  }
};
