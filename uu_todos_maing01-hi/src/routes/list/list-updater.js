//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState} from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";
import Config from "./config/config.js";

const STATICS = {
  displayName: Config.TAG + "ListUpdater",
};


const ListUpdater = createVisualComponent({
  ...STATICS,

  render(props) {
      const {data, setUpdateState, getConfirmRef} = props
      const [value, setValue]= useState(data.data.name)
      const [forceDelete, setForceDelete] = useState(false)

      const confirm = props.getConfirmRef();

      async function handleUpdate(){
        if(value!==data.data.name){
          const sendedValue = {name: `${value}`}
          await data.handlerMap.update(sendedValue)
        }
         setUpdateState(false)
    }

  async function handleDelete(){
      if(forceDelete === true){
        await data.handlerMap.delete({"forceDelete": true})
      }else{
       try {
        await data.handlerMap.delete()
       } catch(e) {
        confirm.open({
          header: <UU5.Bricks.Header level={4} content="Error" />,
          content: <UU5.Bricks.Text>{e.message}</UU5.Bricks.Text>,
          on: () =>  confirm.close(),
        })
       }
      }
     
        setUpdateState(false)
    }

  function handleChangeForceDelete(){
       forceDelete === false ? setForceDelete(true):  setForceDelete(false)
     
    }

    return (
      <div>
         <UU5.Forms.Text name="name" value={value} onChange={(e)=> setValue(e.value)}/>
         <div style={{display: "flex", alignItems: "flex-end", justifyContent:"space-between"}}>
         <UU5.Forms.Checkbox size="s" label="force delete" value={forceDelete} onChange={()=> handleChangeForceDelete()}/> 
         <UU5.Bricks.Button bgStyle="transparent" onClick={()=>  { 
              return confirm.open({
                header: <UU5.Bricks.Header level={4} content="Delete this list?" />,
                content: <UU5.Bricks.Div>Do you really want to delete this list?</UU5.Bricks.Div>,
                on: () =>  confirm.close(),
                onConfirm: ()=> handleDelete()
              })
            }}><UU5.Bricks.Icon icon="plus4u-bin"/></UU5.Bricks.Button> 
         <UU5.Bricks.Button onClick={()=>handleUpdate()}><UU5.Bricks.Icon icon="plus4u-task"/></UU5.Bricks.Button> 
         </div>
        
      </div>
    );
  },
});

export default ListUpdater;
