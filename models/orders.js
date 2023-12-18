const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //Since Product is mandarory for creating orders, qe link product schema with orderschema
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
})

module.exports = mongoose.model('Orders', orderSchema)