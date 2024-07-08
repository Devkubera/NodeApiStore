// local module
const orderModel = require('../models/orderModel')
const Response = require('../responses/response')

exports.getAllOrders = async (req, res) => {
    try {
        const { _id, username, role } = req.auth
        // Admin show all orders
        if (role === 'admin') {
            const orders = await orderModel.find()

            if (orders.length <= 0 || !orders) {
                return Response(res, 'no data', 200, [])
            }

            return Response(res, 'success', 200, orders)
        }
        // User show order is about of them
        if (role === 'user') {
            const orders = await orderModel.find({ user_id: _id})

            if (orders.length <= 0 ||  !orders) {
                return Response(res, 'no data', 200, [])
            }

            return Response(res, 'success', 200, orders)
        }
    } catch (error) {
        console.error('error to fetch order: ', error)
        return Response(res, 'Internal Server Error', 500)
    }
}