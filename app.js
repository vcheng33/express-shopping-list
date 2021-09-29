"use strict";

const express = require("express");
const { NotFoundError } = require("./expressError");
const fsP = require("fs/promises");
const morgan = require("morgan");
const db = require("./fakeDb");

const app = express();

app.use(express.json());

app.use(express.urlencoded( {extended: true }));

app.use(morgan("dev"));


// ROUTES

/** Returns list of shopping items
 * { items: [
    { name: "popsicle", price: 1.45 },
    { name: "cheerios", price: 3.40 }
    ]} 
*/
app.get("/items", function(req, res) {
    const shoppingItems = db.items;
    return res.json(shoppingItems);
})

app.post("/items", function(req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const newItem = { name, price };
    db.items.push(newItem);
    return res
        .status(201)
        .json({ "added": newItem});
})

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Error handler: logs stacktrace and returns JSON error message. */
  app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const message = err.message;
    if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
    return res.status(status).json({ error: { message, status } });
  });
  
  
  module.exports = app;