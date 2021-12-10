//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";
import Lsi from "../../config/lsi.js";
import ListUpdater from "./list-updater.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  //@@viewOff:statics
};

const CLASS_NAMES = {

};

export const OneList = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
  const {list, getConfirmRef} = props
  const [updateState, setUpdateState] = useState(false)

    function handleUpdate( ){
     setUpdateState(true)
    }
    
    
    return (
                   <div>
                    {updateState ? <ListUpdater data={list} getConfirmRef={getConfirmRef} setUpdateState={setUpdateState}/> :   
                    <div>
                        <UU5.Bricks.Lsi lsi={Lsi.left.list(list?.data.name)} /> 
                        <UU5.Bricks.Button bgStyle="outline" onClick={()=>handleUpdate()}><UU5.Bricks.Icon icon="plus4u5-pencil" /></UU5.Bricks.Button> 
                        </div> }
                  </div>
    );
    //@@viewOff:render
  },
});

export default OneList;
