//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";
import Lsi from "../../config/lsi.js";

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListUpdater",
  //@@viewOff:statics
};

const CLASS_NAMES = {

};

const ListUpdater = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes
  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
      const {data} = props
      const [value, setValue]= useState(data.data.name)

      async function handleUpdate(){
        const sendedValue = {name: `${value}`}
         await data.handlerMap.update(sendedValue)
    }

    async function handleDelete(){
        console.log('Hi')
        await data.handlerMap.delete()
    }

    return (
      <div>
        <UU5.Forms.Text label="Name" name="name" value={value} onChange={(e)=> setValue(e.value)}/>
         <UU5.Bricks.Button onClick={()=> handleDelete()}><UU5.Bricks.Icon icon="plus4u-bin"/></UU5.Bricks.Button> 
         <UU5.Bricks.Button onClick={()=>handleUpdate()}><UU5.Bricks.Icon icon="plus4u-task"/></UU5.Bricks.Button> 
      </div>
    );
    //@@viewOff:render
  },
});

export default ListUpdater;
