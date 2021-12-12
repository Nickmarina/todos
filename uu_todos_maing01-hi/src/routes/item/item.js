//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";
import { ModalManager } from "../list/common/modal-manager.js";
import ItemLoader from "./item-loader.js";
import ItemContext from "./context/item-context.js";
import DataListStateResolver from "../list/common/data-list-state-resolver.js";
import ItemList from "./item-list.js";

const STATICS = {

  displayName: Config.TAG + "Item",
};

export const Item = createVisualComponent({
  ...STATICS,

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
  },
});

export default Item;