//@@viewOn:imports
import "uu5g04-bricks";
import { createComponent, useDataList } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import Calls from "../../calls";
import Config from "../config/config.js";
import ItemContext from "./context/item-context";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListLoader",
  //@@viewOff:statics
};

const CLASS_NAMES = {
};

export const ItemLoader = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    const dataListResult = useDataList({
      handlerMap: {
        load: Calls.itemList,
        create: Calls.itemCreate,
      },
      itemHandlerMap: {
        update: Calls.itemUpdate,
        delete: Calls.itemDelete,
      }
    });
    
    return (
       <ItemContext.Provider value={dataListResult}>{props.children}</ItemContext.Provider>
    );
    //@@viewOff:render
  },
});

export default ItemLoader;