const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/update";

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"123test", "name":"123test" }) 
});

afterAll(async () => {
  await TestHelper.teardown();
});



describe(`Testing  the list/update...`, () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn={
        name: "updated",
        description: "updated"
    }
    const list = await TestHelper.executePostCommand("list/create", { name:"name"}, session);
    const result = await TestHelper.executePostCommand("list/update", {id: list.id, ...dtoIn}, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

});