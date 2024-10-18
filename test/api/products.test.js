const { spec } = require("pactum");
const { faker } = require("@faker-js/faker");

let token;
let productId;
let categoryId;

before(async () => {

  token = await spec()
    .post("http://lojaebac.ebaconline.art.br/public/authUser")
    .withJson({
      email: "admin@admin.com",
      password: "admin123",
    })
    .returns("data.token");
});

describe("API - Products", () => {

  before(async () => {
    const response = await spec()
      .get("http://lojaebac.ebaconline.art.br/public/getCategories")
      .expectStatus(200);

    categoryId = response.body.categories[0]._id.name;
  });

  it("Deve adicionar um novo produto", async () => {
    const response = await spec()
      .post("http://lojaebac.ebaconline.art.br/api/addProduct")
      .withHeaders("Authorization", token)
      .withJson({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        quantity: faker.string.numeric(1),
        categories: categoryId,
        description: faker.lorem.sentence(),
        photos: faker.image.url(),
        popular: faker.datatype.boolean(),
        visible: faker.datatype.boolean(),
        location: faker.location.city(),
        additionalDetails: faker.lorem.paragraph(),
        specialPrice: faker.commerce.price(),
      })
      .expectStatus(200)
      .expectJson("success", true);

    productId = response.body.data._id;
  });

  it("Deve editar um produto existente", async () => {

    await spec()
      .put(`http://lojaebac.ebaconline.art.br/api/editProduct/${productId}`)
      .withHeaders("Authorization", token)
      .withJson({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        quantity: faker.string.numeric(1),
        categories: categoryId,
        description: faker.lorem.sentence(),
        photos: faker.image.url(),
        popular: faker.datatype.boolean(),
        visible: faker.datatype.boolean(),
        location: faker.location.city(),
        additionalDetails: faker.lorem.paragraph(),
        specialPrice: faker.commerce.price(),
      })
      .expectStatus(200)
      .expectJson("success", true);
  });

  it("Deve deletar um produto", async () => {

    await spec()
      .delete(
        `http://lojaebac.ebaconline.art.br/api/deleteProduct/${productId}`
      )
      .withHeaders("Authorization", token)
      .expectStatus(200)
      .expectJson("success", true);
  });
});
