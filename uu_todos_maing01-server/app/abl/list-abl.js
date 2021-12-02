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
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  }
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.mainDao = DaoFactory.getDao('todoInstance')
    this.dao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item")
  }

  async list(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("listListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.listUnsupportedKeys.code,
        Errors.List.InvalidDtoIn
    ); 
    
    let uuObject = {...dtoIn, awid}
    if(!uuObject.pageInfo.pageIndex)uuObject.pageInfo.pageIndex = 0
    if(!uuObject.pageInfo.pageSize)uuObject.pageInfo.pageSize
    const pageInfo = {pageIndex: uuObject.pageInfo.pageIndex, pageSize: uuObject.pageInfo.pageSize}
    if(!uuObject.pageInfo) uuObject.pageInfo = pageInfo
 
    // HDS 2
    const  todoInstance = await this.mainDao.getByAwid(uuObject.awid)
    if(!todoInstance){
        throw new Errors.List.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid: uuObject.awid})
    }
    if ( todoInstance.state !== 'active') {
      throw new Errors.List.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid: uuObject.awid, currentState:  todoInstance.state, expectedState: "active" })
    }

    // HDS 3
    const  itemList = await this.dao.list(uuObject.awid, pageInfo)

    // HDS 4
    return{
      ...itemList,
      pageInfo,
      uuAppErrorMap
    }
  }
  

  async delete(awid, dtoIn, uuAppErrorMap) {
    // HDS 1
    const validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        WARNINGS.deleteUnsupportedKeys.code,
        Errors.Delete.InvalidDtoIn
    ); 

    const uuObject = {awid, ...dtoIn}
    if(!uuObject.forceDelete) uuObject.forceDelete = false
    
    // HDS 2
    const  todoInstance = await this.mainDao.getByAwid(uuObject.awid)
    if(!todoInstance){
        throw new Errors.Delete.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid: uuObject.awid})
    }

    if ( todoInstance.state !== 'active') {
      throw new Errors.Delete.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState:  todoInstance.state, expectedState: "active" })
    }

    // HDS 3
    const list = await this.dao.get(awid, dtoIn.id)
    if(!list){
      throw new Errors.Delete.ListDoesNotExist({uuAppErrorMap}, {id:uuObject.id})
    }

    // HDS 4 
    let items = await this.itemDao.listByListId(uuObject.awid ,uuObject.id, 0)
    // console.log(items)
    if(items.itemList.length>0&&uuObject.forceDelete === false){
      throw new Errors.Delete.ListContainsActiveItems({uuAppErrorMap}, {id: uuObject.id, itemList: items})
    }

    // HDS 5
    if(items) {
      await items.itemList.map(item => {
        this.itemDao.delete(uuObject.awid, item.id)
      })
    }
    
    // HDS 6
    await this.dao.delete(uuObject.awid, uuObject.id)

    // HDS 7 
    return {
      uuAppErrorMap
    }
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
