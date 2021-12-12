import "uu5g04-bricks";
import { createComponent, useDataList } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import Calls from "../../calls";
import Config from "../config/config.js";
import ListContext from "./context/list-context";


const STATICS = {
  displayName: Config.TAG + "ListLoader",
};

export const ListLoader = createComponent({
  ...STATICS,

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
  },
});

export default ListLoader;