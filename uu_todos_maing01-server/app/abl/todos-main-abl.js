"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/todos-main-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

const logger = LoggerFactory.get("TodosMainAbl");

class TodosMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("todoInstance")
  }

  async init(uri, dtoIn, session, uuAppErrorMap) {
    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("sysUuAppWorkspaceInitDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["todoInstance", "list", "item"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);


    if (dtoIn.uuBtLocationUri) {
      const baseUri = uri.getBaseUri();
      const uuBtUriBuilder = UriBuilder.parse(dtoIn.uuBtLocationUri);
      const location = uuBtUriBuilder.getParameters().id;
      const uuBtBaseUri = uuBtUriBuilder.toUri().getBaseUri();

      const createAwscDtoIn = {
        name: "UuTodos",
        typeCode: "uu-todos-maing01",
        location: location,
        uuAppWorkspaceUri: baseUri,
      };

      const awscCreateUri = uuBtUriBuilder.setUseCase("uuAwsc/create").toUri();
      const appClientToken = await AppClientTokenService.createToken(uri, uuBtBaseUri);
      const callOpts = AppClientTokenService.setToken({ session }, appClientToken);

      // TODO HDS
      let awscId;
      try {
        const awscDtoOut = await AppClient.post(awscCreateUri, createAwscDtoIn, callOpts);
        awscId = awscDtoOut.id;
      } catch (e) {
        if (e.code.includes("applicationIsAlreadyConnected") && e.paramMap.id) {
          logger.warn(`Awsc already exists id=${e.paramMap.id}.`, e);
          awscId = e.paramMap.id;
        } else {
          throw new Errors.Init.CreateAwscFailed({ uuAppErrorMap }, { location: dtoIn.uuBtLocationUri }, e);
        }
      }

      const artifactUri = uuBtUriBuilder.setUseCase(null).clearParameters().setParameter("id", awscId).toUri();

      await UuAppWorkspace.connectArtifact(
        baseUri,
        {
          artifactUri: artifactUri.toString(),
          synchronizeArtifactBasicAttributes: false,
        },
        session
      );
    }

    
    const {uuAppProfileAuthorities, ...restDtoIn} = dtoIn

    // HDS 3
    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.SetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // HDS 4 - HDS N
    // TODO Implement according to application needs...

    // HDS N+1
    // const workspace = UuAppWorkspace.get(awid);

    const uuObject ={ ...restDtoIn, state: "active", awid};

    let uuTodoInstance = null;
      
    try{
      uuTodoInstance= await this.dao.create(uuObject)
    }catch (e){
      throw new Errors.Init.TodoInstanceCreateDaoFailed({uuAppErrorMap}, e)
    }

    return {
      ...uuTodoInstance,
      uuAppErrorMap: uuAppErrorMap,
    };
  }
}

module.exports = new TodosMainAbl();
