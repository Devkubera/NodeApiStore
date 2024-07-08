module.exports = (res, message, status, data) => {
    return res.status(status).send({
        message: message,
        status: status,
        data: data
    })
}