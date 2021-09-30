"use strict";
const request = require("supertest");

const app = require("./app");
const db = require("./fakeDb");

const pickle = { name: "pickle", price: "5.00" };

beforeEach(function () {
    db.items.push({...pickle});
});

afterEach(function () {
    debugger;
    db.items = [];
});

/** GET /items - returns `{ items: [
    { name: "pickle", price: "5.00" },
    ]} ` */

describe("GET /items", function () {
    it("Gets a list of items", async function () {
        const resp = await request(app).get(`/items`);

        expect(resp.body).toEqual([{ name: "pickle", price: "5.00" }]);
    });
});


/** GET /items/[name] - return data about one item: `{ name: "pickle", price: "5.00" }` */

describe("GET /items/:name", function () {
    it("Gets a single item", async function () {
        const resp = await request(app).get(`/items/pickle`);

        expect(resp.body).toEqual({ name: "pickle", price: "5.00" });
        expect(resp.statusCode).toEqual(200);
    });

    it("Responds with 404 if can't find cat", async function () {
        const resp = await request(app).get(`/items/taco`);
        expect(resp.statusCode).toEqual(404);
    });
});


/** POST /items - create item from data; 
 * return `{added: {name: popsicle, price:"500"}}` */

describe("POST /items", function () {
    it("Creates a new item", async function () {
        const resp = await request(app)
            .post(`/items`)
            .send({
                name: "popsicle",
                price: "500"
            });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            added: { name: "popsicle", price: "500" }
        });
    });
});


/** PATCH /items/[name] - update item; 
 * return `{updated: {name: "fudgicle", price: "2.45"}` */

describe("PATCH /items/:name", function () {
    it("Updates a single item", async function () {
        const resp = await request(app)
            .patch(`/items/pickle`)
            .send({
                name: "fudgicle",
                price: "2.45",
            });
        expect(resp.body).toEqual({
            updated: { name: "fudgicle", price: "2.45" }
        });
    });

    it("Responds with 404 if name invalid", async function () {
        const resp = await request(app)
            .patch(`/items/not-pickle`)
            .send({
                name: "fudgicle",
                price: "2.45",
            });
        expect(resp.statusCode).toEqual(404);
    });

    it("Responds with 400 if price invalid", async function () {
        const resp = await request(app)
            .patch(`/items/pickle`)
            .send({
                name: "fudgicle",
                price: "JIBBERISH",
            });
        expect(resp.statusCode).toEqual(400);
    });
});


/** DELETE /items/[name] - delete item,
 *  return `{message: "deleted"}` */

describe("DELETE /items/:name", function () {
    it("Deletes a single a item", async function () {
        const resp = await request(app)
            .delete(`/items/pickle`);
        expect(resp.body).toEqual({ message: "Deleted" });
        expect(db.items.length).toEqual(0);
    });
});


// Check let vs. const