const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// local module
const UserModel = require('../models/userModel')
const Response = require('../responses/response')

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        // check form
        if (!username || !password) {
            return Response(res, 'Bad request.', 400)
        }
        // find account
        const result = await UserModel.findOne({ username: username })
        // check account
        if (!result) {
            return Response(res, 'Not found user. Please register before login.', 400)
        }
        // compare password
        const isPwdCorrect = await bcrypt.compare(password, result.password)
        // check password
        if (!isPwdCorrect) {
            return Response(res, 'Incorrect password.', 400)
        }
        // check approved
        if (result.isApprove === false) {
            return Response(res, 'Please contact admin to verify your account.', 400)
        }
        console.log('login: success')
        // sign token
        const token = jwt.sign({
            _id: result._id,
            username: result.username,
            role: result.role
        }, process.env.JWT_KEY, { expiresIn: '1h' })

        return Response(res, 'Login success.', 200, {
            _id: result._id,
            username: username,
            token: token,
            role: result.role
        })
    } catch (error) {
        console.error('login failed: ', error)
        return Response(res, 'Internal Server Error.', 500)
    }
}

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return Response(res, 'Bad request', 400)
        }
        // check account is already exits?
        if (await UserModel.findOne({ username: username })) {
            return Response(res, 'Username is already exits. Please try another username.', 400)
        }
        // await every time when you do something that might TAKE A TIME !!!!!!!!!!!!!!!
        const hash = await bcrypt.hash(password, 10)
        // create new user
        const newUser = new UserModel({
            username: username,
            password: hash
        })
        // save new user model to mongoDB
        const result = await newUser.save()

        if (result) {
            return Response(res, 'Register Success.', 201, {
                _id: result._id,
                username: result.username,
                role: result.role
            })
        }

    } catch (error) {
        console.error('register failed: ', error)
        return Response(res, 'Internal Server Error.', 500)
    }
}

exports.approve = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.auth

        if (role !== 'admin') {
            return Response(res, 'Please contact admin to verify.', 400)
        }

        // find and update
        // thrid params "new" is mean tell mongoDB return a newest docs data back
        const user = await UserModel.findByIdAndUpdate({ _id: id }, { isApprove: true }, { new: true })
        if (user) {
            return Response(res, 'Approve success!', 200, {
                _id: id,
                username: user.username,
                isApprove: user.isApprove
            })
        }

    } catch (error) {
        console.error('Approve Failed: ', error)
        return Response(res, 'Internal Server Error', 500)
    }
}

exports.identify = async (req, res) => {
    try {
        const { _id, token } = req.auth
        console.log('token: ', req.auth)
        const user = await UserModel.findById({ _id: _id })
        // console.log('res: ', user)
        const data = {
            username: user.username,
            _id: user._id,
            role: user.role
        }
        return Response(res, 'Identify pass.', 200, data)
    } catch (error) {
        console.error('Identify Failed: ', error)
        return Response(res, 'Internal Server Error', 500)
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const { _id, token } = req.auth
        console.log('token: ', req.auth)
        const result = await UserModel.find()
        const users = []
        result.forEach((user) => {
            if (user.role !== 'admin') {
                users.push({ _id: user._id, username: user.username, role: user.role, isApprove: user.isApprove })
            }
        })
        // console.log('result: ', res)
        // console.log('result to fetch approve list: ', users)
        return Response(res, 'Fetch approve list success!', 200, users)
    } catch (error) {
        console.error('Get Approve List Failed: ', error)
        return Response(res, 'Internal Server Error', 500)
    }
}