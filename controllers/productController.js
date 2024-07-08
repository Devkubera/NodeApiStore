// local module
const productModel = require('../models/productModel')
const orderModel = require('../models/orderModel')
const Response = require('../responses/response')

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find()
        return Response(res, 'success', 200, products)
    } catch (error) {
        console.error("erorr: ", error)
        return Response(res, 'Internal Server Error', 500, products)
    }
}

exports.getProdById = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.auth
        // check role here
        if (role !== 'admin') {
            return Response(res, 'Auth failed', 400, {})
        }
        const product = await productModel.findById(id)
        if (!product) {
            return Response(res, 'Not found', 404, {})
        }
        return Response(res, 'Success', 200, product)
    } catch (error) {
        console.error("error to fetch product: ", error)
        Response(res, 'Something wrong', 500)
    }
}

exports.addProduct = async (req, res) => {
    try {
        const { name, stock, price } = req.body
        const { role } = req.auth
        // check role here
        if (role !== 'admin') {
            return Response(res, 'Auth failed', 400)
        }
        if (!name || !stock || !price) {
            return Response(res, 'Bad request', 400)
        }
        const newProduct = new productModel({
            name,
            stock,
            price
        })
        const product = await newProduct.save()
        if (product) {
            return Response(res, 'Add product success', 201, {
                name: product.name,
                stock: product.stock,
                price: product.price
            })
        }

    } catch (error) {
        console.error("error to add product: ", error)
        Response(res, 'Something wrong', 500)
    }
}

exports.deleteProd = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.auth
        // check role here
        if (role !== 'admin') {
            return res.status(400).send({
                message: "Auth failed",
                status: 400
            })
        }

        const product = await productModel.findByIdAndDelete(id)

        if (!product) {
            return res.status(400).send({
                message: "Item not exits in database.",
                status: 400
            })
        }

        res.send({
            message: 'delete success',
            status: 200,
            data: product
        })

    } catch (error) {
        console.error('delete product failed: ', error)
        res.status(500).send({
            message: 'Something wrong',
            status: 500,
            data: {}
        })
    }
}

exports.updateProd = async (req, res) => {
    try {
        const { id } = req.params
        const { name, stock, price } = req.body
        const { role } = req.auth
        // check role here
        if (role !== 'admin') {
            return res.status(400).send({
                message: "Auth failed",
                status: 400
            })
        }
        if (!id) {
            return res.status(400).send({
                message: "Missing ID!",
                status: 400,
                data: {}
            })
        }
        if (!name && !stock && !price) {
            return res.status(400).send({
                message: "Require at least one field!",
                status: 400,
                data: {}
            })
        }
        const oldProduct = await productModel.findById(id)
        const updateProduct = {
            name: name || oldProduct.name,
            stock: stock !== undefined ? Number(stock) : oldProduct.stock,
            price: price !== undefined ? Number(price) : oldProduct.price
        }
        console.log('update product : ', updateProduct)
        const product = await productModel.findByIdAndUpdate({ _id : id }, updateProduct, { new: true })
        res.send({
            message: 'update success',
            status: 200,
            data: product
        })
    } catch (error) {
        console.error('delete product failed: ', error)
        res.status(500).send({
            message: 'Something wrong',
            status: 500,
            data: {}
        })
    }
}

// ORDER SECTION

exports.addOrder = async (req, res) => {
    try {
        const { _id } = req.auth
        const { count } = req.body
        const { id } = req.params
        const user_id = _id
        const prod_id = id

        if (!count || Number(count) <= 0) {
            return res.status(400).send({
                message: 'Bad request.',
                status: 400
            })
        }
        // check stock
        const product = await productModel.findById(prod_id)
        if (Number(count) > Number(product.stock)) {
            return res.status(400).send({
                message: 'Cannot order. products in stock not enough left.',
                status: 400
            })
        }
        // add order
        const newOrder = {
            "user_id": user_id,
            "prod_id": prod_id,
            "count": Number(count)
        }
        const order = await orderModel.create(newOrder)
        // update stock
        const newStock = Number(product.stock) - Number(count)
        const newProduct = await productModel.findByIdAndUpdate(prod_id, { stock: newStock }, { new: true })

        res.send({
            message: 'create order success',
            status: 200,
            data: {
                order: {
                    _id: order._id,
                    user_id: order.user_id,
                    prod_id: order.prod_id,
                    count: order.count
                },
                product: {
                    prod_id: order.prod_id,
                    name: newProduct.name,
                    stock: newProduct.stock
                }
            }
        })
    } catch (error) {
        console.error('error to add order: ', error)
        res.status(500).send({
            message: 'Something wrong',
            status: 500
        })
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const { role } = req.auth
        const { id } = req.params
        const prod_id = id

        if (role !== 'admin') {
            return Response(res, 'Bad request', 400)
        }

        const orders = await orderModel.find({ prod_id: prod_id })
        if (!orders || orders.length <= 0) {
            return Response(res, 'No order.', [])
        }
        return Response(res, 'success', 200, orders)
        
    } catch (error) {
        console.error('error to add order: ', error)
        return Response(res, 'Something wrong', 500)
    }
}