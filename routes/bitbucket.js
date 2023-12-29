const express = require('express')
const router = express.Router()
const axios = require('axios')
const io = require('../server')
const JIRA_USER_EMAIL = 'choudhary.aman@senrysa.com'
const JIRA_API_TOKEN = 'ATATT3xFfGF0m--lWK8DTCoz-YEd6tWxteRbFnb2d4iOgMc4yOVPwOMAqXeQqqwmadSFIQw1rxG2_NTSvxBHdWb23rdIEDhm2nxblOd2heP33ayPdtSEbtDohZiSKgNx-4GSWzZErKIfhQ4H2N-EjGVZXHCm1hYkww0-HbOfoIAojqpfL84GO6U=590DEAA8'
const db = require("../db")



const bufferObj = Buffer.from(
    `${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`
).toString('base64')

const headers = {
    'Authorization': `Basic ${bufferObj}`, // Example authorization header, replace with your actual token
    'Content-Type': 'application/json', // Example custom header, add more headers as needed
};

router.post("/webhook/get", (req, res, next) => {
    const ticketId = req.body.pullrequest.title.split('/').pop()
    console.log("ticketId", req.body)
    try {
        const responseData = {
            message: 'Fetching all records',
            records: req.body
        };
        axios.post('http://localhost:3005/bitbucket/webhook/add', ticketId)
            .then(response => {
                // Process the response from the other API
                const responseData = response.data;
                console.log("RESSSS", responseData)

                // Send a response to the client or do other processing
                res.json({ result: 'Success', data: responseData });
            })
            .catch(error => {
                console.error('Error:', error);

                // Handle the error and send an appropriate response to the client
                res.status(500).json({ result: 'Error', error: error.message });
            });



    } catch (e) {
        console.log("Error:", e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});;

router.post("/webhook/add", (req, res, next) => {
    const ticketId = req.ticketId
    let obj = {}
    try {
        axios.get(`https://senrysa.atlassian.net/rest/api/2/issue/${ticketId}`, { headers })
            .then(response => {

                // Handle the response data here
                const data = response.data
                obj['ticket_id'] = data.key;
                obj['summary'] = data.fields.summary
                obj['priority'] = data.fields.priority.name
                obj['assignee'] = data.fields.assignee.displayName
                obj['status'] = data.fields.status.name

                const sql = 'INSERT INTO bitbucket (ticket_id, summary,priority,assignee,status) VALUES (?, ?,?,?,?)'
                db.run(sql, [data.key, data.fields.summary, data.fields.priority.name, data.fields.assignee.displayName, data.fields.status.name], function (err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // Send a response indicating success
                    res.json({ message: 'User added successfully', userId: this.lastID });
                });
                // return res.status(200).json({ message: 'FETCH SUCCESSFUL', res: response.data });

            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error.message);
            });
    } catch (e) {
        console.log("Error:", e);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});;

router.get('/webhook/getAllTickets', (req, res) => {
    // Query to retrieve all records from the "users" table
    const sql = 'SELECT * FROM bitbucket';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Send the retrieved records as a response
        res.json({ users: rows });
    });
});

module.exports = router