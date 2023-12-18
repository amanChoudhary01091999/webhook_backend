const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const chekAuth = require('../middlewares/check-auth')
const html_to_pdf = require('html-pdf-node');
let options = { format: 'A4' };



const Product = require("../models/products")

router.get("/", (req, res, next) => {
    console.log(req)
    Product.find()
        .select("_id name price")
        .then((result) => {
            if (result) {
                const response = {
                    count: result.length,
                    products: result
                }
                res.status(200).json({
                    response

                })
            } else {
                res.status(400).json({ message: "Not found" })
            }
        }).catch((e) => {
            res.status(500).json({ message: e })
        })
})

router.post("/s3bucket", (req, res, next) => {

    let options = { format: 'A4' };
    const arr1 = { content: `<h1>My name is ${req.body.name}</h1>` }
    html_to_pdf.generatePdf(arr1, options).then(pdfBuffer => {

        console.log("pdfBuffer", pdfBuffer)
    });
})


router.post("/", chekAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    product.save().then((result) => {
        const response = {
            _id: result._id,
            name: result.name,
            price: result.price
        }
        res.status(200).json({
            response
        })

    }).catch((error) => res.status(500).json({ error: error }))


})


router.get("/:id", (req, res, next) => {
    const id = req.params.id
    Product.findById(id).then((result) => {
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(400).json({ message: 'Record not found' })
        }

    }).catch((err) => res.status(500).json({ error: err }))

})


router.patch("/:id", (req, res, next) => {
    const id = req.params.id
    const updateOptions = {}
    for (const objs of req.body) {

        updateOptions[objs.propName] = objs.value
    }
    Product.updateOne({ _id: id }, { $set: updateOptions }).then((result) => {
        res.status(200).json(result)
    }).catch((e) => res.status(500).json({ message: e }))

})


router.put("/:id", (req, res, next) => {
    const id = req.params.id
    const updateOptions = req.body
    Product.updateOne({ _id: id }, { $set: updateOptions }).then((result) => {
        res.status(200).json(result)
    }).catch((e) => res.status(500).json({ message: e }))

})




router.delete("/:id", (req, res, next) => {
    const id = req.params.id
    Product.deleteOne({ _id: id }).then((result) => {
        if (result) {
            res.status(200).json({ message: 'Product Deleted', product: result })
        } else {
            res.status(400).json({ message: 'Product Not Found' })
        }
    }).catch((e) => res.status(500).json({ message: e }))
})



module.exports = router