const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')

const Orders = require('../models/orders')
const Products = require('../models/products')
router.get("/", (req, res, next) => {
    Orders.find()
        // .exec()
        // .populate('product', 'name price _id')//the 'product' is the refernce we created for order with product schema...look for ordr model
        // .select('_id quantity')
        .then((result) => {
            if (result.length) {
                res.status(200).json({ result })
            } else {
                res.status(400).json({ message: 'List is empty' })
            }

        }).catch((e) => res.status(500).json({ message: e }))
})


router.get("/:id", (req, res, next) => {
    const id = req.params.id
    console.log("paramsss", req.params)
    Orders.findById(id)
        .populate('product')
        .then((result) => {
            if (result) {
                res.status(200).json({ message: result })
            }
        }).catch((e) => res.status(500).json({ message: e }))
})

router.get("/:webhook/:service/:provider", (req, res, next) => {
    console.log("paramsss", req.params)

    // const { webhook, service, provider } = req.params
    // console.log(webhook, service, provider, "Hello")
    let params = {}
    Object.entries(req.params).forEach(([key, value]) => {
        params[key] = value.toLowerCase()
    });
    console.log(params)
    // Object.keys(req.params).forEach((x) => {
    //     params.x = req.params[x].toLowerCase()
    // })
    // console.log('params', params)
    // Orders.findById(id)
    //     .populate('product')
    //     .then((result) => {
    //         if (result) {
    //             res.status(200).json({ message: result })
    //         }
    //     }).catch((e) => res.status(500).json({ message: e }))
})


router.post("/", (req, res, next) => {
    Products.findById({ _id: req.body.product })
        .then((response) => {
            const Order = new Orders({
                _id: new mongoose.Types.ObjectId(),
                product: response._id,
                quantity: req.body.quantity
            })
            Order.save()
                .then((result) => {
                    if (result) {
                        res.status(200).json(result)
                    }
                }).catch((e) => res.status(500).json({ message: e }))

        })
        .catch((e) => {
            res.status(500).json({ message: 'Prduct Not found' })
        })

})


router.delete("/:id", (req, res, next) => {
    const id = req.params.id
    Orders.deleteOne({ _id: id })
        .then((result) => res.status(200).json({ message: 'Deleted Successfully' }))
        .catch((e) => res.status(500).json({ message: e }))

})



router.put("/:id", (req, res, next) => {
    const id = req.params.id
    const updatedObj = req.body
    Orders.updateOne({ _id: id }, { $set: updatedObj }).then((result) => {
        if (result) {
            res.status(200).json({ message: result })
        }
    }).catch((e) => res.status(500).json({ message: e }))
})

router.patch("/:id", (req, res, next) => {
    const params = req.params.id
    const newcreatedBody = {}
    for (const obj of req.body) {
        newcreatedBody[obj.field] = obj.value
    }
    Orders.updateOne({ _id: params }, { $set: newcreatedBody })
        .then((result) => res.status(200).json({ result }))
        .catch((e) => res.status(500).json({ message: e }))

})






module.exports = router