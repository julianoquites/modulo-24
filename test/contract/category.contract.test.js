// const { reporter, spec } = require("pactum");
// const pf = require("pactum-flow-plugin");
// const { faker } = require("@faker-js/faker");

// function addFlowReporter() {
//   pf.config.url = "http://localhost:8080";
//   pf.config.projectId = "lojaebac-api-categorias"; // Projeto único para categorias
//   pf.config.projectName = "Loja EBAC API - Categorias";

//   const uniqueSuffix = Math.random().toString(36).substring(2, 8);
//   const timestamp = Date.now();
//   pf.config.version = `1.6.${timestamp}_${uniqueSuffix}`;

//   pf.config.username = "scanner";
//   pf.config.password = "scanner";
//   reporter.add(pf.reporter);
// }

// // Global before
// before(async () => {
//   addFlowReporter();
// });

// // Global after
// after(async () => {
//   await reporter.end();
//   // Limpar fluxos e interações
//   spec.clear();
// });

// describe("API - Categories", () => {
//   let token;
//   let categoryId;

//   before(async () => {
//     token = await spec()
//       .post("http://lojaebac.ebaconline.art.br/public/authUser")
//       .withJson({
//         email: "admin@admin.com",
//         password: "admin123",
//       })
//       .returns("data.token");
//   });

//   it("API - deve adicionar uma categoria corretamente", async () => {
//     const response = await spec()
//       .post("http://lojaebac.ebaconline.art.br/api/addCategory")
//       .withHeaders("Authorization", token)
//       .withJson({
//         name: faker.commerce.department(),
//         photo: faker.image.url(),
//       })
//       .expectStatus(200)
//       .expectJson("success", true)
//       .expectJson("message", "category added");

//     categoryId = response.body.data._id;
//   });
// });
