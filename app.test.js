test.js
"use strict";
const request = require("supertest");

const app = require("../app");
let db = require("../fakeDb");

let pickles = { name: "Pickles" };

beforeEach(function() {
  db.Cat.add(pickles);
});

afterEach(function() {
  db.Cat.deleteAll();
});
// end


/** GET /cats - returns `{cats: [cat, ...]}` */

describe("GET /cats", function() {
  it("Gets a list of cats", async function() {
    const resp = await request(app).get(`/cats`);

    expect(resp.body).toEqual({ cats: [pickles] });
  });
});
// end

/** GET /cats/[name] - return data about one cat: `{cat: cat}` */

describe("GET /cats/:name", function() {
  it("Gets a single cat", async function() {
    const resp = await request(app).get(`/cats/${pickles.name}`);

    expect(resp.body).toEqual({ cat: pickles });
  });

  it("Responds with 404 if can't find cat", async function() {
    const resp = await request(app).get(`/cats/not-here`);
    expect(resp.statusCode).toEqual(404);
  });
});
// end

/** POST /cats - create cat from data; return `{cat: cat}` */

describe("POST /cats", function() {
  it("Creates a new cat", async function() {
    const resp = await request(app)
      .post(`/cats`)
      .send({
        name: "Ezra"
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      cat: { name: "Ezra" }
    });
  });
});
// end

/** PATCH /cats/[name] - update cat; return `{cat: cat}` */

describe("PATCH /cats/:name", function() {
  it("Updates a single cat", async function() {
    const resp = await request(app)
      .patch(`/cats/${pickles.name}`)
      .send({
        name: "Troll"
      });
    expect(resp.body).toEqual({
      cat: { name: "Troll" }
    });
  });

  it("Responds with 404 if name invalid", async function() {
    const resp = await request(app).patch(`/cats/not-here`);
    expect(resp.statusCode).toEqual(404);
  });
});
// end

/** DELETE /cats/[name] - delete cat,
 *  return `{message: "Cat deleted"}` */

describe("DELETE /cats/:name", function() {
  it("Deletes a single a cat", async function() {
    const resp = await request(app)
      .delete(`/cats/${pickles.name}`);
    expect(resp.body).toEqual({ message: "Deleted" });
    expect(db.Cat.all().length).toEqual(0);
  });
});
// end
