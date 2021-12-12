import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";
import { ListCreateHeader, ListCreateControls, ListCreateForm } from "./list-create-form/list-create-form";
import { useContextModal } from "./common/modal-manager";
import {useList} from "./context/use-list";
import OneList from "./one-list.js";


const STATICS = {
  displayName: Config.TAG + "List",

};



export const List = createVisualComponent({
  ...STATICS,
  render(props) {
  const {data, handlerMap} = useList()
  const [open, close, showAlert, getConfirmRef] = useContextModal()

    function handleCreateList() {
      open({
        header:<ListCreateHeader/>,
        content: <ListCreateForm closeModal={close} handlerMap={handlerMap} />,
        footer:<ListCreateControls/>
      });
    }
    
    return (
      <div>
                <Plus4U5.App.MenuTree
                borderBottom
                items = {data?.map(list=> (       
                  { id: list?.data.id, href: `list?listId=${list?.data.id}`, content: 
                    <OneList list={list} getConfirmRef={getConfirmRef}/>
                }
                ))}
               />
               <UU5.Bricks.Button colorSchema="blue" bgStyle="transparent" content="+ Create list" onClick={()=> handleCreateList()}/>
      </div>
    );
  },
});

export default List;
