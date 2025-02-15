const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')


// login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email: email })


        if (!user || user.password != password) {
            return res.status(401).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        let token = await jwt.sign({ payload: user }, 'rohit', { expiresIn: '4hr' })

        return res.status(200).send({
            success: true,
            message: 'User logged in successfully',
            token
        })

    } catch (err) {
        return res.status(505).send({
            success: false,
            error: err
        })
    }
}


// ragister
const registerUser = async (req, res) => {
    try {
        const { name, email, password, city, gender, phone } = req.body;

        if (!name || !email || !password || !city || !gender || !phone) {
            return res.status(400).json({
                message: "Please fill all the fields."
            });
        }

        const dup = await User.findOne({ email: email });
        if (dup) {
            return res.status(400).send({
                success: false,
                message: "Email already exists."
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            city,
            gender,
            phone

        })

        return res.status(201).send({
            success: true,
            message: "User created successfully.",
            user: user
        });

    } catch (err) {
        return res.status(505).send({
            success: false,
            error: err
        })
    }
}


// view
const viewUser = async (req, res) => {
    try {

        let users = await User.find({})
        return res.status(200).send({
            success: true,
            message: "Users fetched successfully.",
            users: users
        });

    } catch (err) {
        return res.status(505).send({
            success: false,
            error: err
        })
    }
}


// dlt
const deleteUser = async (req, res) => {
    try {
        let id = req.query.id
        let user = await User.findByIdAndDelete(id)
        return res.status(200).send({
            success: true,
            message: "User deleted successfully.",
            user: user
        });


    } catch (err) {
        return res.status(505).send({
            success: false,
            error: err
        })
    }
}

// update
const updateUser = async (req, res) => {
    try {
        let id = req.query.id
        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password

        })
        return res.status(200).send({
            success: true,
            message: "User updated successfully.",

        });
    } catch (err) {
        return res.status(505).send({
            success: false,
            error: err
        })
    }
}


module.exports = {
    registerUser,
    viewUser,
    deleteUser,
    updateUser,
    loginUser
}