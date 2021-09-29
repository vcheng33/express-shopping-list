"use strict";

const express = require("express");
const { NotFoundError } = require("./expressError");
const app = express();

const itemsRouter = require("./itemsRouter");

const morgan = require("morgan");
const db = require("./fakeDb");


app.use(express.json());

app.use(express.urlencoded( {extended: true }));

app.use(morgan("dev"));


//Rotues--------------------------

app.use("/items", itemsRouter);

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