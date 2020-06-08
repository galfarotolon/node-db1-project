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
            res.status(500).json({ message: err.message })
        })

});

router.get("/:id", (req, res) => {
    // select * from posts where id = req.params.id
    knex
        .from("posts")
        .select("*")
        // .where("id", "=", req.params.id)
        // .where("id", req.params.id)
        .where({ id: req.params.id })
        .first()
        .then(post => {
            res.status(200).json({ data: post });
        })
        .catch(error => {
            console.log("GET / error", error);
            res.status(500).json({ message: error.message });
        });
});

router.post('/', (req, res) => {

    knex("posts")
        .insert(req.body, "id")
        .then(([id]) => {
            res.status(201).json({ data: id })
        })
        .catch(error => {
            console.log("GET / error", error);
            res.status(500).json({ message: error.message });
        });

});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    knex('posts').where({ id }).update(changes)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'record updated' })
            } else {
                res.status(404).json({ message: "no records were found" })
            }
        }).catch(error => {
            console.log("GET / error", error);
            res.status(500).json({ message: error.message });
        });

});

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    knex("posts")
        .where({ id }) // if not using a where, all records will be removed
        .del() // <----- don't forget this part
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "record deleted successfully" });
            } else {
                res.status(404).json({ message: "no records found" });
            }
        })
        .catch(error => {
            console.log("GET / error", error);
            res.status(500).json({ message: error.message });
        });
});

module.exports = router;