"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
  // listDoesNotExist: {
  //   code: `${Errors.Update.UC_CODE}unsupportedKeys`,

  // },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.mainDao = DaoFactory.getDao('todoInstance')
    this.dao = DaoFactory.getDao("list");
  }

  async delete(awid, dtoIn) {
    // HDS 1
    const validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.deleteUnsupportedKeys.code,
        Errors.Delete.InvalidDtoIn
    ); 
    
    // HDS 2
    const uuTodos = await this.mainDao.getByAwid(awid)
    if(!uuTodos){
        throw new Errors.Delete.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }

    if (uuTodos.state !== 'active') {
      throw new Errors.Delete.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: uuTodos.state, expectedState: "active" })
    }

    // // HDS 3
    // const uuList = await this.dao.get(awid, dtoIn.id)
    // if(!uuList){
    //   ValidationHelper.addWarning(
    //     uuAppErrorMap,
    //     WARNINGS.listDoesNotExist.code,
    //     WARNINGS.listDoesNotExist.message,
    //     { list: dtoIn.ide }
    //   );
    // }

  }

  async create(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.createUnsupportedKeys.code,
        Errors.Create.InvalidDtoIn
    );

    // HDS 2
    const uuTodos = await this.mainDao.getByAwid(awid)
    if(!uuTodos){
        throw new Errors.Create.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }

    if (uuTodos.state !== 'active') {
      throw new Errors.Create.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: uuTodos.state, expectedState: "active" })
    }

    // HDS 3
    
    if(dtoIn.deadline){
      const inputDate = new Date(dtoIn.deadline);
        const currentDate = new Date();
        if(inputDate.getTime() < currentDate.getTime()){
          throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline });
        }
  }
    // HDS 4
    const uuObject= { ...dtoIn, awid};

    let uuList = null;
    try {
        uuList = await this.dao.create(uuObject);
    } catch (err) {
        throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5
    return {
        ...uuList,
        uuAppErrorMap
    }
  }

  async get(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.getUnsupportedKeys.code,
        Errors.Get.InvalidDtoIn
    );

    // HDS 2
    const uuTodos = await this.mainDao.getByAwid(awid)
    if(!uuTodos){
        throw new Errors.Get.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }

    if (uuTodos && uuTodos.state !== 'active') {
      throw new Errors.Get.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: uuTodos.state, expectedState: "active" })
    }

    // HDS 3
    const uuTodo = await this.dao.get(awid, dtoIn.id)
    if(!uuTodo){
        throw new Errors.Get.ListDoesNotExist({ uuAppErrorMap },{todo: dtoIn.id})
    }

    // HDS 4
    return {
        ...uuTodo,
        uuAppErrorMap
    }
  }
  async update(awid, dtoIn, uuAppErrorMap) {
    // HDS 1 
    const validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.updateUnsupportedKeys.code,
        Errors.Update.InvalidDtoIn
    );

    // HDS 2 
    const uuTodos = await this.mainDao.getByAwid(awid)
    if(!uuTodos){
        throw new Errors.Update.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }

    if (uuTodos.state !== 'active') {
      throw new Errors.Update.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: uuTodos.state, expectedState: "active" })
    }

    // HDS 3
    
    if(dtoIn.deadline){
      const inputDate = new Date(dtoIn.deadline);
        const currentDate = new Date();
        if(inputDate.getTime() < currentDate.getTime()){
          throw new Errors.Update.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline });
        }
    }

    // HDS 4 
    const uuObject= { ...dtoIn, awid};
    // find
    const uuFindTodo = await this.dao.get(awid, uuObject.id);
    if(!uuFindTodo){
      throw new Errors.Get.ListDoesNotExist({ uuAppErrorMap },{todo: uuObject.id})
    }
    // update
    let uuTodo = null;
    try {
      uuTodo =  await this.dao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.ListDaoUpdateFailed({ uuAppErrorMap }, err);
    }

  //  HDS 5 
    return {
      ...uuTodo,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
