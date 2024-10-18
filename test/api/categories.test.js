const { spec } = require("pactum");
const { faker } = require("@faker-js/faker");

let token;

before(async () => {
  token = await spec()
    .post("http://lojaebac.ebaconline.art.br/public/authUser")
    .withJson({
      email: "admin@admin.com",
      password: "admin123",
    })
    .returns("data.token");
});

describe("API - Categories", () => {
  let categoryId;
  it("Deve adicionar uma nova categoria", async () => {
    const response = await spec()
      .post("http://lojaebac.ebaconline.art.br/api/addCategory")
      .withHeaders("Authorization", token)
      .withJson({
        name: faker.commerce.department(),
        photo: faker.image.url(),
      })
      .expectStatus(200)
      .expectJson("success", true);

    categoryId = response.body.data._id;
  });

  it("Deve editar uma categoria existente", async () => {

    await spec()
      .put(`http://lojaebac.ebaconline.art.br/api/editCategory/${categoryId}`)
      .withHeaders("Authorization", token)
      .withJson({
        name: faker.commerce.department(),
        photo: faker.image.url(),
      })
      .expectStatus(200)
      .expectJson("success", true);
  });

  it("Deve deletar uma categoria", async () => {
    
    await spec()
      .delete(
        `http://lojaebac.ebaconline.art.br/api/deleteCategory/${categoryId}`
      )
      .withHeaders("Authorization", token)
      .expectStatus(200)
      .expectJson("success", true);
  });
});
