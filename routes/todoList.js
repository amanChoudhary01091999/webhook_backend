const express = require('express')
const router = express.Router()
let fs = require("fs");
let auth = require("../middlewares/check-auth")
router.get("/", (req, res, next) => {
    try {
        fs.readFile('input.txt', function (err, todoJson) {
            if (err) {
                return console.error(err);
            }
            else {
                const stri = JSON.parse(todoJson)
                res.status(200).json({ message: 'Fetching All Records', response: stri })
            }
        });
    }
    catch (e) {
        return res.status(401).json({ message: e })
    }
})


router.post('/', auth, (req, res, next) => {
    const reqBody = req.body
    console.log("reqBody", req)

    const todo = {
        id: reqBody.id,
        name: reqBody.name,
    }
    fs.readFile('input.txt', function (err, todoJson) {
        if (err) {
            return console.error(err);
        }
        else {
            const stri = JSON.parse(todoJson)
            stri.push(todo)
            let newData2 = JSON.stringify(stri)
            fs.writeFile('input.txt', newData2, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(200).json({ message: 'Record Added successfully' })
                }
            })
        }
    });
})



router.put('/:id', (req, res, next) => {
    const reqBody = req.body
    const id = req.params.id

    fs.readFile('input.txt', function (err, todoJson) {
        if (err) {
            return console.error(err);
        }
        else {
            const stri = JSON.parse(todoJson)
            let foundId = stri.find((x) => Number(x.id) === Number(id))
            if (foundId) {
                stri[id - 1] = { id: req.params.id, name: reqBody.name }
                let newData = JSON.stringify(stri)
                fs.writeFile('input.txt', newData, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.status(200).json({ message: 'Record Updated successfully' })
                    }
                })

            }
            else {
                res.status(404).json({ response: "No Record Found" })
            }
        }
    });
})


router.get('/:id', (req, res, next) => {
    const id = req.params.id
    fs.readFile('input.txt', function (err, todoJson) {
        if (err) {
            return console.error(err);
        }
        else {
            const stri = JSON.parse(todoJson)
            let foundId = stri.find((x) => Number(x.id) === Number(id))
            console.log("foundId", foundId)
            if (foundId) {
                res.status(200).json({ response: foundId })
            }
            else {
                res.status(404).json({ response: "No Record Found" })
            }
        }
    });
})


router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    fs.readFile('input.txt', function (err, todoJson) {
        if (err) {
            return console.error(err);
        }
        else {
            const stri = JSON.parse(todoJson)
            const val = stri.filter((x) => Number(x.id) !== Number(id))
            console.log("VALLL", val)

            let newData2 = JSON.stringify(val)
            fs.writeFile('input.txt', newData2, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.status(200).json({ message: 'Record Deleted successfully' })
                }
            })

        }
    });
})






module.exports = router