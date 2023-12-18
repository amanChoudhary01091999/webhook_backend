const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const decode = jwt.verify(req.body.token, "MY SECRET KEY")
        req.userBody = decode
        next()


    } catch (e) {
        return res.status(401).json({ message: e })
    }
}