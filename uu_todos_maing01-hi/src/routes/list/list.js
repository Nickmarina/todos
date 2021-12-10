//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";
import Lsi from "../../config/lsi.js";
import { ListCreateHeader, ListCreateControls, ListCreateForm } from "./list-create-form/list-create-form";
import { useContextModal } from "./common/modal-manager";
import {useList} from "./context/use-list";
import ListUpdater from "./list-updater.js";
import OneList from "./one-list.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  //@@viewOff:statics
};

const CLASS_NAMES = {

};

export const List = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
  const {data, handlerMap} = useList()
  const [update, setUpdate] = useState(false)

      // const [value, setValue]= useState('');
    // const [upadatedMenu, setUpdatedMenu] = useState('false')
    const [open, close, showAlert, getConfirmRef] = useContextModal()

    function handleCreateList() {
      open({
        header:<ListCreateHeader/>,
        content: <ListCreateForm closeModal={close} handlerMap={handlerMap} />,
        footer:<ListCreateControls/>
      });
    }

    function handleUpdate( data, ){
      if(data) setUpdate(true)
    }
    
    
    return (
      <div>
                <Plus4U5.App.MenuTree
                borderBottom
                // NOTE Item "id" equals to useCase so that item gets automatically selected when route changes (see spa-autheticated.js).
                items = {data?.map(list=> (       
                  { id: list?.data.id, href: `list?listId=${list?.data.id}`, content: 
                  <OneList list={list}/>
                  //  <div>
                  //   <UU5.Bricks.Lsi lsi={Lsi.left.list(list?.data.name)} /> 
                  //    <UU5.Bricks.Button><UU5.Bricks.Icon icon="plus4u5-pencil"/></UU5.Bricks.Button> 
                  //    <ListUpdater data={list}/>
                  // </div>
                }
                ))}
               />
               <UU5.Bricks.Button content="Add new list" onClick={()=> handleCreateList()}/>
      </div>
    );
    //@@viewOff:render
  },
});

export default List;
