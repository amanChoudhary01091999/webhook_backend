const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post("/signup", (req, res, next) => {
    console.log("REQQ", req, res)
    User.find({ email: req.body.email }).then((user) => {
        if (user.length) {
            res.status(409).json({ message: "Email already exists" })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        message: err
                    })
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash

                    })

                    user.save()
                        .then((data) => {
                            res.status(200).json({
                                message: "User Created",
                                user: user
                            })

                        })
                        .catch((err) => {
                            res.status(500).json({
                                message: err
                            })
                        })
                }
            })
        }
    })
})


router.post("/login", (req, res, next) => {
    console.log("usss", req, res)
    User.find({ email: req.body.email })
        .then((user) => {
            if (user.length < 1) {
                return res.status(500).json({
                    message: "User not found"
                })
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: err })
                    }
                    if (result) {
                        const token = jwt.sign(
                            { email: user[0].email, _id: user[0]._id }
                            , "MY SECRET KEY",
                            { expiresIn: '1h' })
                        return res.status(200).json({ message: "Login Success", token: token })
                    }

                    res.status(401).json({
                        message: 'Auth Failed'
                    })
                })
            }
        })
})


router.delete('/:id', (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .then((data) => {
            res.status(200).json({
                message: "User deleted"
            })
        }).catch((err) => {
            res.status(500).json({ message: err })
        })
})


router.get("/", (req, res, next) => {
    User.find()
        .then((data) => {
            res.status(200).json({
                message: "Users",
                user: data
            })
        })
        .catch((e) => {
            res.status(500).json({ message: e })
        })
})



module.exports = router