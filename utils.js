"use strict";
const { BadRequestError } = require("./expressError");


/** Check string can be converted to num */

function IsValidNum(string) {
  //loop through the string array
    if (isNaN(Number(string))) {
        throw new BadRequestError();
    } else {
        return true;
    }
}

module.exports = { IsValidNum };