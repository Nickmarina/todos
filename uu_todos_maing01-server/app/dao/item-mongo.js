"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, state: 1, listId: 1});
    await super.createIndex({ awid: 1, state: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async setFinalState(awid, id, state){
    const filter = {
      awid,
      id,
    }
    return await super.findOneAndUpdate(filter, {state}, "NONE");
  }
  
  async delete(awid, id){
    let filter = {
      awid,
      id
    };
    return await super.deleteOne(filter);
  }
//   deleteManyByListId(awid, listId) -> void

  // async list (awid, pageInfo){
  //     return await super.find({awid}, pageInfo);
  // }
   async list (awid, pageInfo){
      return await super.find({awid}, pageInfo);
  }

  async listByListIdAndState(awid, listId, state, pageInfo){
    const uuObject = {awid, listId, state}
    return await super.find(uuObject, pageInfo)
  }

  async listByState (awid, state, pageInfo) {
    const uuObject = {awid, state}
    return await super.find(uuObject,pageInfo )
  }

  async listByListId (awid, listId, pageInfo) {
    const uuObject = {awid, listId}
    return await super.find(uuObject,pageInfo )
  }
}

module.exports = ItemMongo;
