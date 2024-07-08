const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer ")[1]
        if (!token) {
            return res.status(401).send({
                message: 'auth failed',
                status: 401
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.auth = decoded
        return next()
    } catch (error) {
        console.log('auth failed: ', error)
        return res.status(401).send({
            message: 'auth failed',
            status: 401
        })
    }
}