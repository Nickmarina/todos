const { TestHelper } = require("uu_appg01_server-test");
const CMD = "item/setFinalStatee";
afterEach(async () => {
    await TestHelper.dropDatabase();
    await TestHelper.teardown();

})

beforeAll(async () => {
    await TestHelper.setup();
    await TestHelper.initUuSubAppInstance();
    await TestHelper.createUuAppWorkspace();
    await TestHelper.initUuAppWorkspace({ "uuAppProfileAuthorities": "urn:uu:GGPLUS4U", "code":"123", "name":"123" }) 
});

describe("Testing the item/setFinalState...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let list =  await TestHelper.executePostCommand("list/create", {name:"name"}, session)
    let item = await TestHelper.executePostCommand("item/create", {listId: list.id, text: "test message"}, session);
    let dtoIn = {
        id: item.id,
        state: "completed"
    }
    let result = await TestHelper.executePostCommand("item/setFinalState", dtoIn, session)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });
});