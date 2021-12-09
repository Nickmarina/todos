//@@viewOn:imports
import "uu5g04-bricks";
import { createComponent, useDataList } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import Calls from "../../calls";
import Config from "../config/config.js";
import ListContext from "./context/list-context";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListLoader",
  //@@viewOff:statics
};

const CLASS_NAMES = {
};

export const ListLoader = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    const dataListResult = useDataList({
      handlerMap: {
        load: Calls.todosList,
        create: Calls.listCreate,
      },
      itemHandlerMap: {
        update: Calls.listUpdate,
        delete: Calls.listDelete,
      }
    });
    
    return (
       <ListContext.Provider value={dataListResult}>{props.children}</ListContext.Provider>
    );
    //@@viewOff:render
  },
});

export default ListLoader;