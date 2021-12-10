//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";
import { ModalManager } from "../list/common/modal-manager.js";
import ItemLoader from "./item-loader.js";
import ItemContext from "./context/item-context.js";
import DataListStateResolver from "../list/common/data-list-state-resolver.js";
import ItemList from "./item-list.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  //@@viewOff:statics
};

const CLASS_NAMES = {

};

export const Item = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    
    return (
      <ModalManager>
       <ItemLoader>
           <ItemContext.Consumer>
               {
                   (dataListResult)=>{
                       return(
                        <DataListStateResolver dataList={dataListResult}>
                            <ItemList params={props.params}/>
                        </DataListStateResolver>
                       )
                   }
               }
           </ItemContext.Consumer>

       </ItemLoader>
    </ModalManager>
    );
    //@@viewOff:render
  },
});

export default Item;