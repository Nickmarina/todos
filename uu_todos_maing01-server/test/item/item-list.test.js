const { TestHelper } = require("uu_appg01_server-test");
const CMD = "item/list";
afterEach(async () => {
    await TestHelper.dropDatabase();
    await TestHelper.teardown();

})

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"123test", "name":"123test" }) 
});

describe("Testing the item/list...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let result = await TestHelper.executeGetCommand("item/list", { awid: TestHelper.awid}, session)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
  test("test if listId&&state", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const list =  await TestHelper.executePostCommand("list/create", {name:"name"}, session)
    const item = await TestHelper.executePostCommand("item/create", {listId: list.id, text: "test message"}, session);
    let result = await TestHelper.executeGetCommand("item/list", { awid: TestHelper.awid, dtoIn:{listId: item.listId, state:item.state}}, session)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
  test("test if only state", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const list =  await TestHelper.executePostCommand("list/create", {name:"name"}, session)
    const item = await TestHelper.executePostCommand("item/create", {listId: list.id, text: "test message"}, session);
    let result = await TestHelper.executeGetCommand("item/list", { awid: TestHelper.awid, dtoIn:{state:item.state}}, session)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
  test("test if only listId", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const list =  await TestHelper.executePostCommand("list/create", {name:"name"}, session)
    const item = await TestHelper.executePostCommand("item/create", {listId: list.id, text: "test message"}, session);
    let result = await TestHelper.executeGetCommand("item/list", { awid: TestHelper.awid, dtoIn:{listId: item.listId}}, session)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    });
  test("TodoInstanceDoesNotExist", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    let filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ awid: `test` })}}`;
    await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${params});`);
    let expectedError = {
      code: `{CMD}/todoInstanceDoesNotExist`,
      message: "TodoInstance does not exist.",
      paramMap:{awid: TestHelper.awid}
    };
    expect.assertions(3);
    try {
        await TestHelper.executeGetCommand("item/list", { awid: TestHelper.awid}, session)
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);

      if(error.paramMap&&expectedError.paramMap){
        expect(error.paramMap).toEqual(expectedError.paramMap);
      }
    }
  });

  test("TodoInstanceIsNotInProperState", async () => {
    let session = await TestHelper.login("Authorities", false, false);
    let filter = `{awid: "${TestHelper.awid}"}`;
    const params = `{$set: ${JSON.stringify({ state: `test` })}}`;
    await TestHelper.executeDbScript(`db.todoInstance.findOneAndUpdate(${filter}, ${params})`);
    let expectedError = {
      code: `{CMD}/todoInstanceIsNotInProperState`,
      message: "The application is not in proper state.",
      paramMap:{awid: TestHelper.awid, expectedState:"active", currentState: "test"}
    };
    expect.assertions(3);
    try {
        await TestHelper.executeGetCommand("item/list", { awid: TestHelper.awid}, session)
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.message).toEqual(expectedError.message);

      if(error.paramMap&&expectedError.paramMap){
        expect(error.paramMap).toEqual(expectedError.paramMap);
      }
    }
  });
});