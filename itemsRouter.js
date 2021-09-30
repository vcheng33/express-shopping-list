"use strict";
/** Routes for sample app. */

const express = require("express");
const { NotFoundError, BadRequestError } = require("./expressError");
// const { isValidNum } = require("./utils");

const db = require("./fakeDb");
const router = new express.Router();

// ROUTES

/** Returns list of shopping items
 * { items: [
    { name: "popsicle", price: 1.45 },
    { name: "cheerios", price: 3.40 }
    ]} 
*/
router.get("/", function (req, res) {
    const shoppingItems = db.items;
    return res.json(shoppingItems);
});

router.post("/", function (req, res) {
    // destructure
    const name = req.body.name;
    const price = req.body.price;
    const newItem = { name, price };
    db.items.push(newItem);
    return res
        .status(201)
        .json({ "added": newItem });
});

/** GET /items/:name: returns json like
 * {name: "popsicle", "price": "1.45"} or 404. */

router.get("/:name", function (req, res, next) {
    const name = req.params.name;
    for (let item of db.items) {
        if (item.name === name) {
            return res.json(item);
        }
    }
    throw new NotFoundError();
});


/** PATCH /items/:name: update name and/or price. 
 *  If price input is invalid, returns 400, otherwise
 *  returns 404.
*/

router.patch("/:name", function (req, res, next) {
    if (isNaN(Number(req.body.price))) {
        throw new BadRequestError();
    }
    const name = req.params.name;
    for (let item of db.items) {
        if (item.name === name) {
            item.name = req.body.name;
            item.price = req.body.price;
            return res.json({ updated: item });
        }
    }
    throw new NotFoundError();
});
// use .find() and .findIndex()
/** delete item and returns {message: "Deleted"}
 *  if successful. Otherwise, returns error.
  */
router.delete("/:name", function (req, res, next) {
    const name = req.params.name;
    debugger;
    for (let item of db.items) {
        if (item.name === name) {
            index = db.items.indexOf(item);
            db.items.splice(index, 1);
            return res.json({ message: "Deleted" });
        }
    }
    throw new NotFoundError();
});

module.exports = router;
