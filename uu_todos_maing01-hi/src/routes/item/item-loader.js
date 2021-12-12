import "uu5g04-bricks";
import { createComponent, useDataList } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import Calls from "../../calls";
import Config from "../config/config.js";
import ItemContext from "./context/item-context";


const STATICS = {
  displayName: Config.TAG + "ListLoader",

};



export const ItemLoader = createComponent({
  ...STATICS,


  render(props) {
    const dataListResult = useDataList({
      handlerMap: {
        load: Calls.itemList,
        create: Calls.itemCreate,
      },
      itemHandlerMap: {
        update: Calls.itemUpdate,
        delete: Calls.itemDelete,
        setFinalState: Calls.itemSetFinalState,
      }
    });
    
    return (
       <ItemContext.Provider value={dataListResult}>{props.children}</ItemContext.Provider>
    );
  },
});

export default ItemLoader;