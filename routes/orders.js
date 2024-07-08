// 3rd module
const { Router } = require('express')

// local module
const verifyToken = require('../middlewares/jwt_decode')
const orderController = require('../controllers/orderController')

// initialize
const router = Router()

// GET all orders by admin
router.get('/orders', verifyToken, orderController.getAllOrders)

// PUT update order
// router.put('/orders/:id', verifyToken, async (req, res) => {
    // try {
        
    // } catch (error) {
        // console.error('update order failed: ', error)
        // res.status(500).send({
        //     message: 'Something wrong',
        //     status: 500
        // })
    // }
// })

// PUT delete order
// router.delete('/orders/:id', verifyToken, async (req, res) => {
//     try {
        
//     } catch (error) {
//         console.error('delete order failed: ', error)
//         res.status(500).send({
//             message: 'Something wrong',
//             status: 500
//         })
//     }
// })

module.exports = router