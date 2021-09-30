"use strict";
const request = require("supertest");

const app = require("./app");
let db = require("./fakeDb");

let pickle = { name: "pickle", price: "5.00" };

beforeEach(function() {
  db.items.push(pickle);
});

afterEach(function() {
  db.items = [];
});

/** GET /items - returns `{ items: [
    { name: "pickle", price: "5.00" },
    ]} ` */

describe("GET /items", function() {
  it("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual([{ name: "pickle", price: "5.00" }]);
  });
});


// end

/** GET /items/[name] - return data about one item: `{ name: "pickle", price: "5.00" }` */

describe("GET /items/:name", function() {
  it("Gets a single item", async function() {
    const resp = await request(app).get(`/items/pickle`);

    expect(resp.body).toEqual({ name: "pickle", price: "5.00" });
    expect(resp.statusCode).toEqual(200);
  });

  it("Responds with 404 if can't find cat", async function() {
    const resp = await request(app).get(`/items/taco`);
    expect(resp.statusCode).toEqual(404);
  });
});
// // end

/** POST /items - create item from data; return `{name: popsicle, price:"500"}` */

describe("POST /items", function() {
  it("Creates a new item", async function() {
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
// // end

// /** PATCH /cats/[name] - update cat; return `{cat: cat}` */

// describe("PATCH /cats/:name", function() {
//   it("Updates a single cat", async function() {
//     const resp = await request(app)
//       .patch(`/cats/${pickles.name}`)
//       .send({
//         name: "Troll"
//       });
//     expect(resp.body).toEqual({
//       cat: { name: "Troll" }
//     });
//   });

//   it("Responds with 404 if name invalid", async function() {
//     const resp = await request(app).patch(`/cats/not-here`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
// // end

// /** DELETE /cats/[name] - delete cat,
//  *  return `{message: "Cat deleted"}` */

// describe("DELETE /cats/:name", function() {
//   it("Deletes a single a cat", async function() {
//     const resp = await request(app)
//       .delete(`/cats/${pickles.name}`);
//     expect(resp.body).toEqual({ message: "Deleted" });
//     expect(db.Cat.all().length).toEqual(0);
//   });
// });
