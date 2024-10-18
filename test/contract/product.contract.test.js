const { reporter, flow, handler, mock } = require("pactum");
const pf = require("pactum-flow-plugin");
const { faker } = require("@faker-js/faker");
const { like } = require("pactum-matchers");

let categoryName;
let token;

function addFlowReporter() {
  pf.config.url = "http://localhost:8080";
  pf.config.projectId = "lojaebac-front-produtos";
  pf.config.projectName = "Loja EBAC Front - Produtos";

  const uniqueSuffix = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now();
  pf.config.version = `1.5.${timestamp}_${uniqueSuffix}`;

  pf.config.username = "scanner";
  pf.config.password = "scanner";
  reporter.add(pf.reporter);
}

// Global before
before(async () => {
  addFlowReporter();
  await mock.start(4000);

  token = await flow("Login")
    .post("http://lojaebac.ebaconline.art.br/public/authUser")
    .withJson({
      email: "admin@admin.com",
      password: "admin123",
    })
    .returns("data.token");

  const response = await flow("Get Categories")
    .get("http://lojaebac.ebaconline.art.br/public/getCategories")
    .expectStatus(200);

  categoryName = response.body.categories[0].name;
});

// Global after
after(async () => {
  await mock.stop();
  // Limpar fluxos e interações
  flow.clear();
  handler.clear();
});

// Adicionando o handler da interação
handler.addInteractionHandler("Add Product Response", () => {
  return {
    provider: "lojaebac-api",
    flow: "Add Product",
    request: {
      method: "POST",
      path: "/api/addProduct",
      headers: {
        authorization: like(`Bearer ${token}`),
        "content-type": "application/json",
      },
      body: {
        name: like(faker.commerce.productName()),
        price: like(faker.commerce.price()),
        quantity: like(faker.string.numeric(1)),
        categories: like(categoryName),
        description: like(faker.lorem.sentence()),
        photos: like(faker.image.url()),
        popular: like(faker.datatype.boolean()),
        visible: like(faker.datatype.boolean()),
        location: like(faker.location.city()),
        additionalDetails: like(faker.lorem.paragraph()),
        specialPrice: like(faker.commerce.price()),
      },
    },
    response: {
      status: 200,
      body: {
        success: true,
        data: {
          _id: like("someProductId"),
          name: like("Test Product"),
          price: like(parseFloat(faker.commerce.price())),
        },
      },
    },
  };
});

// Teste para adicionar um novo produto usando o mock
it("FRONT - deve adicionar um novo produto", async () => {
  await flow("Add Product")
    .useInteraction("Add Product Response")
    .post("http://localhost:4000/api/addProduct")
    .withHeaders("Authorization", `Bearer ${token}`)
    .withJson({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      quantity: faker.string.numeric(1),
      categories: categoryName,
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

// Chame o reporter.end() apenas após todos os testes
after(async () => {
  await reporter.end();
  // Limpar fluxos e interações
  flow.clear();
  handler.clear();
});
