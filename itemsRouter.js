/** Routes for sample app. */

const express = require("express");
const { NotFoundError } = require("./expressError");

const db = require("./fakeDb");
const router = new express.Router();

// /** GET /users: get list of users */
// router.get("/", function (req, res, next) {
//     return res.json(db.User.all());
// });

// /** DELETE /users/[id]: delete user, return {message: Deleted} */
// router.delete("/:id", function (req, res, next) {
//     db.User.delete(req.params.id);
//     return res.json({ message: "Deleted" });
// });

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
    const name = req.body.name;
    const price = req.body.price;
    const newItem = { name, price };
    db.items.push(newItem);
    return res
        .status(201)
        .json({ "added": newItem });
});

router.get("/", function (req, res) {
    const shoppingItems = db.items;
    return res.json(shoppingItems);
});

/** GET /items/:name: returns name {cat} or 404. */

router.get("/:name", function (req, res, next) {
    const name = req.params.name;
    for (let item of db.items){
        if(item.name === name){
            return res.json(item);
        }
    }
    throw new NotFoundError();
  });


/** PATCH /items/:name: update name or 404. */

router.patch("/:name", function (req, res, next) {
    const name = req.params.name;
    for (let item of db.items){
        if(item.name === name){
            item.name = req.body.name;
            item.price = req.body.price;
            return res.json({updated: item});
        }
    }
    throw new NotFoundError();
  });

module.exports = router;
