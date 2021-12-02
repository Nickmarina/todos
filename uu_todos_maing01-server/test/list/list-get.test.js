const { TestHelper } = require("uu_appg01_server-test");

const useCase = "list/get";

afterEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.teardown();
});

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"123test", "name":"123test" }) 
});



describe(`Testing  the list/get...`, () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      name:"name"
    };
    
    const list = await TestHelper.executePostCommand("list/create", dtoIn, session);
    const result = await TestHelper.executeGetCommand("list/get", {id: list.id}, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  // test.only("TodoInstanceDoesNotExist", async () => {
  //   let session = await TestHelper.login("Authorities", false, false);
  //   let filter = `{awid:"${TestHelper.awid}"}`;
  //   const params = `{$set: ${JSON.stringify({ awid: `test` })}}`;
  //   await TestHelper.executeDbScript(`db.todoInstance.findOneandApdate(${filter}, ${params});`);
  //   let expectedError = {
  //     code: `{CMD}/todoInstanceDoesNotExist`,
  //     message: "TodoInstance does not exist.",
  //     paramMap:{awid: TestHelper.awid}
  //   };
  //   expect.assertions(3);
  //   try {
  //     await TestHelper.executePostCommand("list/get", { name:"New list" },session);
  //   } catch (error) {
  //     expect(error.status).toEqual(400);
  //     expect(error.message).toEqual(expectedError.message);

  //     if(error.paramMap&&expectedError.paramMap){
  //       expect(error.paramMap).toEqual(expectedError.paramMap);
  //     }
  //   }

  // });

});