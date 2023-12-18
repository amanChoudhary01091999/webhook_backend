const express = require('express')
const router = express.Router()



router.post("/webhook/get", (req, res, next) => {
    console.log("RESSS", res)
    res.status(200).json({
        message: 'Fetching all records',
        records: res
    })
})

module.exports = router