const express = require('express');

// database access using knex
const knex = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {

    knex
        .select("*")
        .from("accounts")
        .then(acc => {
            res.status(200).json({ data: acc })
        })
        .catch(err => {
            console.log("GET / error", err)
            res.status(500).json({ message: 'account list not found' })
        })

});

router.get("/:id", (req, res) => {

    knex
        .from("accounts")
        .select("*")

        .where({ id: req.params.id })
        .first()
        .then(acc => {
            res.status(200).json({ data: acc });
        })
        .catch(error => {
            console.log("GET / error", error);
            res.status(500).json({ message: 'account id not found' });
        });
});

router.post('/', (req, res) => {

    knex("accounts")
        .insert(req.body, "id")
        .then(([id]) => {
            res.status(201).json({ id: id })
        })
        .catch(error => {
            console.log("GET / error", error);
            res.status(404).json({ message: 'Cannot post at this time. Need to include a unique account name and a budget' });
        });

});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    knex('accounts').where({ id }).update(changes)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'account information updated' })
            } else {
                res.status(404).json({ message: "account could not be updated" })
            }
        }).catch(error => {
            console.log("GET / error", error);
            res.status(500).json({ message: error.message });
        });

});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    knex("accounts")
        .where({ id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "account deleted successfully" });
            } else {
                res.status(404).json({ message: "no accounts found" });
            }
        })
        .catch(error => {
            console.log("GET / error", error);
            res.status(500).json({ message: error.message });
        });
});

module.exports = router;