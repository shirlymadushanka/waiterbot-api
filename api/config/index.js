require('dotenv').config()

module.exports = {
    DB : process.env.DB,
    PORT : process.env.PORT || 3000,
    SECRET :  process.env.SECRET
}