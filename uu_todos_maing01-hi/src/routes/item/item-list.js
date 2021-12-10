//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState, useEffect} from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Uu5Tiles from "uu5tilesg02";
import Config from "./config/config.js";
import {useItem} from "./context/use-item.js";
import {useList} from "../list/context/use-list"
import CustomTile from "./custom-tile";
import { useContextModal } from "../list/common/modal-manager.js";
import {ItemUpdateControls, ItemUpdateForm, ItemUpdateHeader} from "./item-update-form/item-update-form"



//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListItem",
  //@@viewOff:statics
};

const CLASS_NAMES = {

};

export const ItemList = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    useEffect(()=> {
      handlerMap.load({listId: props.params.listId})
    }, [props.params])

  const [open, close, showAlert, getConfirmRef] = useContextModal()
  const {data, handlerMap} = useItem()   

  //@@viewOn:private
  function handleUpdateModal(data) {
    open({
      header:<ItemUpdateHeader/>,
      content: <ItemUpdateForm data={data} closeModal={close}  showAlert={showAlert} />,
      footer:<ItemUpdateControls/>
    });
  }


  async function handleCreateNewItem(e){
    if(e.value.length>0){
      const value = {"text": e.value, "listId": props.params.listId }
      await handlerMap.create(value)
    }
  }

   //@@viewOn:render
   const className = Config.Css.css``;
   const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
   const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
     props,
     STATICS
   );


  
 

   return currentNestingLevel ? (
     <Uu5Tiles.ControllerProvider
       data={data}
     >

      <UU5.Forms.TextButton
        placeholder='Add a new item'
        size="l"
        buttons={[{
          icon: 'plus4u-task',
          onClick: (e) => handleCreateNewItem(e),
          colorSchema: 'info'
        }]}
      />

       <Uu5Tiles.Grid
        //  tileMinWidth={1000}
        //  tileMaxWidth={1200}
         tileSpacing={8}
         rowSpacing={8}
       >
         <CustomTile  handleUpdateModal={handleUpdateModal} getConfirmRef={getConfirmRef}/>

       </Uu5Tiles.Grid>
     </Uu5Tiles.ControllerProvider>
   ) : null;
   //@@viewOff:render
 },
});
export default ItemList;