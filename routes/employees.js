const express = require('express')
const router = express.Router()

const employeeRequest = require("../dummyDb.json")


router.get("/", (req, res, next) => {
    let newArr = []
    employeeRequest.forEach((x) => {

        newArr.push(x)
    })
    res.status(200).json({
        message: 'Fetching all records',
        records: newArr
    })
})

router.get("/asc", (req, res, next) => {
    let newArr = employeeRequest.sort((a, b) => a.id - b.id);
    res.status(200).json({
        message: 'Fetching all records in asc order',
        records: newArr
    })
})






router.get("/:id", (req, res, next) => {
    let idP = req.params.id

    let newElem = employeeRequest.find((x) => {
        return (Number(x.id) === Number(idP))
    })
    res.status(200).json({
        message: `Fetching record with id ${idP} `,
        records: newElem
    })
})

router.get("/active", (req, res, next) => {
    let activeArr = []
    employeeRequest.forEach((x) => {
        if (x.employee) {
            activeArr.push(x)

        }
    })
    res.status(200).json({
        message: 'Fetching all records with active emps',
        records: activeArr
    })
})




module.exports = router