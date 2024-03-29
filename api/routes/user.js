const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail already exist'
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(200).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'user created'
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            }

                            )
                    }
                })
            }

        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })


})

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })//this is to make sure the email entered actually exist
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({  //res status 401 means unauthorised
                    message: 'auth failed'
                })
            }
            //we now compare the hash for this password using bcrypt compare
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'auth failed'
                    })
                }
                if (result) {
                    const token=jwt.sign({
                        email: user[0].email,
                        user_id: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        })
                    return res.status(200).json({
                        message: 'auth successful',
                        token: token
                    })
                }
                else {
                    return res.status(401).json({
                        message: 'auth failed'
                    })
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(res => {
            res.status(200).json({
                message: 'User deleted successfully'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})
module.exports = router