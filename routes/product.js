// 3rd module
const { Router } = require('express')

// local module
const verifyToken = require('../middlewares/jwt_decode')
const prodController = require('../controllers/productController')
// initialize
const router = Router()

// GET get all product
router.get('/products', prodController.getAllProducts)
// GET each product by ID
router.get('/products/:id', verifyToken, prodController.getProdById)
// POST add product
router.post('/products', verifyToken, prodController.addProduct)
// DELETE delete product
router.delete('/products/:id', verifyToken, prodController.deleteProd)
// PUT update product by ID
router.put('/products/:id', verifyToken, prodController.updateProd)
// POST add orders
router.post('/products/:id/orders', verifyToken, prodController.addOrder)
// GET all orders by productID
router.get('/products/:id/orders', verifyToken, prodController.getOrderById)

module.exports = router