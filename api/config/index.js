require('dotenv').config()

module.exports = {
    DB : process.env.DB,
    DB_TEST : process.env.DB_TEST,
    PORT : process.env.PORT || 3000,
    SECRET :  process.env.SECRET
}