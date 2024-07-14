const { Router } = require('express')

// local module
const verifyToken = require('../middlewares/jwt_decode')
const loginController = require('../controllers/loginController')

const router = Router()

// router.post('/test', async (req, res) => {
//     const { username, password } = req.body
//     const hash = await bcrypt.hash(password, 10)
//     const userObj = {
//         username: username,
//         password: hash,
//         role: 'admin',
//         isApprove: true
//     }
//     const data = await UserModel.create(userObj)
//     res.send({
//         message: 'Success',
//         status: 200,
//         data: data
//     })
// })


router.post('/login', loginController.login)
router.post('/register', loginController.register)
router.put('/approve/:id', verifyToken, loginController.approve)
router.get('/identify', verifyToken, loginController.identify)
router.get('/usersApprv', verifyToken, loginController.getAllUsers)

module.exports = router