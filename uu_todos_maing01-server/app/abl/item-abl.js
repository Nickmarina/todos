"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

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
  setFinalStateUnsupportedKeys: {
    code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`,
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
  itemDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}	itemDoesNotExist`,
    message: 'Item with given id does not exist.'
  },

};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.mainDao = DaoFactory.getDao('todoInstance')
    this.listDao = DaoFactory.getDao('list')
    this.dao = DaoFactory.getDao("item");
  }

  async delete(awid, dtoIn, uuAppErrorMap) {
     // HDS 1
     const validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
     uuAppErrorMap = ValidationHelper.processValidationResult(
         dtoIn,
         validationResult,
         WARNINGS.deleteUnsupportedKeys.code,
         Errors.Delete.InvalidDtoIn
     );  

     
     // HDS 2 
     const todoInstance = await this.mainDao.getByAwid(awid)
     if(!todoInstance){
         throw new Errors.Delete.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
     }

     if (todoInstance.state !== 'active') {
       throw new Errors.Delete.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: todoInstance.state, expectedState: "active" })
   }

    //  HDS 3

    const item = await this.dao.get(awid, dtoIn.id)
    
    if(!item){
      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.itemDoesNotExist.code,
        WARNINGS.itemDoesNotExist.message,
        { item: dtoIn.id }
      );
    }
    if (item&&item.state==="completed"){
      throw new Errors.Delete.ItemIsNotInCorectState({uuAppErrorMap},
         {id:dtoIn.id, state: item.state, expectedStateList:  ["active", "cancelled"]})
    }

    // HDS 4 
    if(item) await this.dao.delete(awid, dtoIn.id)

    // HDS 5
    return {
      uuAppErrorMap
    }
  }

  async setFinalState(awid, dtoIn, uuAppErrorMap) {

     // HDS 1
     const validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
     uuAppErrorMap = ValidationHelper.processValidationResult(
         dtoIn,
         validationResult,
         WARNINGS.setFinalStateUnsupportedKeys.code,
         Errors.SetFinalState.InvalidDtoIn
     );

     // HDS 2 
     const todoInstance = await this.mainDao.getByAwid(awid)
     if(!todoInstance){
         throw new Errors.SetFinalState.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
     }

     if (todoInstance.state !== 'active') {
       throw new Errors.SetFinalState.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: todoInstance.state, expectedState: "active" })
   }

    //  HDS 3
    const item = await this.dao.get(awid, dtoIn.id)
     if(!item){
         throw new Errors.SetFinalState.ItemDoesNotExist({ uuAppErrorMap },{item: dtoIn.id})
     }
     if (item.state !== 'active') {
       throw new Errors.SetFinalState.ItemIsNotInProperState({uuAppErrorMap},
         {awid, currentState: item.state, expectedState: "active" })
     }
    
    //  HDS 4
     const updatedItem = await this.dao.setFinalState(awid, dtoIn.id, dtoIn.state)

    //  HDS 5 
    return {
      ...updatedItem,
      uuAppErrorMap
    }
  }

  async update(awid, dtoIn, uuAppErrorMap) {
     // HDS 1
     const validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
     uuAppErrorMap = ValidationHelper.processValidationResult(
         dtoIn,
         validationResult,
         WARNINGS.updateUnsupportedKeys.code,
         Errors.Get.InvalidDtoIn
     );

     // HDS 2 
     const uuTodoInstance = await this.mainDao.getByAwid(awid)
     if(!uuTodoInstance){
         throw new Errors.Update.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
     }

     if (uuTodoInstance.state !== 'active') {
       throw new Errors.Update.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: uuTodoInstance.state, expectedState: "active" })
   }

    //  HDS 3
    const uuObject = {...dtoIn, awid}
     const uuTodo = await this.dao.get(awid, uuObject.id)
    if(!uuTodo){
        throw new Errors.Update.ItemDoesNotExist({ uuAppErrorMap },{todo: uuObject.id})
    }
    if (uuTodo.state !== 'active') {
      throw new Errors.Update.ItemIsNotInCorrectState({uuAppErrorMap},
        {awid, currentState: uuTodo.state, expectedState: "active" })
    }

    // HDS 4
    const uuList = await this.listDao.get(awid, uuObject.listId)
    if(!uuList){
      throw new Errors.Update.ListDoesNotExist({ uuAppErrorMap },{list:uuObject.listId})
    }

    // HDS 5
    let uuItem = null;
    try {
      uuItem =  await this.dao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.ItemDaoUpdateFailed({ uuAppErrorMap }, err);
    }
    // HDS 6
    return{
      ...uuItem,
      uuAppErrorMap
    }
  }

  async get(awid, dtoIn, uuAppErrorMap) {
      // HDS 1
      const validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
      uuAppErrorMap = ValidationHelper.processValidationResult(
          dtoIn,
          validationResult,
          WARNINGS.getUnsupportedKeys.code,
          Errors.Get.InvalidDtoIn
      );

      // HDS 2 
        const uuTodoInstance = await this.mainDao.getByAwid(awid)
      if(!uuTodoInstance){
          throw new Errors.Get.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
      }

      if (uuTodoInstance.state !== 'active') {
        throw new Errors.Get.TodoInstanceIsNotInProperState({uuAppErrorMap},
          {awid, currentState: uuTodoInstance.state, expectedState: "active" })
    }

     // HDS 3
      const uuItem = await this.dao.get(awid, dtoIn.id)
      if(!uuItem){
          throw new Errors.Get.ItemDoesNotExist({ uuAppErrorMap },{item: dtoIn.id})
      }

      // HDS 4
      return{
        ...uuItem,
        uuAppErrorMap
      }
 
  }

  async create(awid, dtoIn, uuAppErrorMap) {
     // HDS 1
     const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
     uuAppErrorMap = ValidationHelper.processValidationResult(
         dtoIn,
         validationResult,
         WARNINGS.createUnsupportedKeys.code,
         Errors.Create.InvalidDtoIn
     );

      // HDS 2
  
    const uuTodoInstance = await this.mainDao.getByAwid(awid)
    if(!uuTodoInstance){
        throw new Errors.Create.TodoInstanceDoesNotExist({uuAppErrorMap}, {awid})
    }

    if (uuTodoInstance.state !== 'active') {
      throw new Errors.Create.TodoInstanceIsNotInProperState({uuAppErrorMap},
         {awid, currentState: uuTodoInstance.state, expectedState: "active" })
    }
    
    // HDS 3 
    const uuObject = {...dtoIn, awid}
    // if(!uuObject.state&&uuObject.state!=="active"){
      uuObject.state = "active"
    // } 

      if(!uuObject.highPriority){
        uuObject.highPriority = false
      }
   
    // HDS 4
    const uuList = await this.listDao.get(awid, uuObject.listId)
    if(!uuList){
      throw new Errors.Create.ListDoesNotExist({ uuAppErrorMap },{list:uuObject.listId})
    }

    // HDS 5
    let uuTodo = null;
    try {
        uuTodo = await this.dao.create(uuObject);
    } catch (err) {
        throw new Errors.Create.ItemDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS 6
    return {
      ...uuTodo,
      uuAppErrorMap
    }
  }
}


module.exports = new ItemAbl()
