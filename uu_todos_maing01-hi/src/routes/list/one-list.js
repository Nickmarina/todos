import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";
import Lsi from "../../config/lsi.js";
import ListUpdater from "./list-updater.js";

const STATICS = {

  displayName: Config.TAG + "OneList",

};



export const OneList = createVisualComponent({
  ...STATICS,

  render(props) {
  const {list, getConfirmRef} = props
  const [updateState, setUpdateState] = useState(false)

    function handleUpdate( ){
     setUpdateState(true)
    }
    
    
    return (
                   <div> 
                    {updateState ? <ListUpdater data={list} getConfirmRef={getConfirmRef} setUpdateState={setUpdateState}/> :   
                    <div >
                        <UU5.Bricks.Lsi lsi={Lsi.left.list(list?.data.name)} /> 
                        <UU5.Bricks.Button bgStyle="transparent" onClick={()=>handleUpdate()}><UU5.Bricks.Icon icon="plus4u5-pencil" /></UU5.Bricks.Button> 
                        </div> }
                  </div>
    );
  },
});

export default OneList;
