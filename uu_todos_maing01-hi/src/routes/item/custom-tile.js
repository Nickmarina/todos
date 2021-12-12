import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";


const STATICS = {

  displayName: Config.TAG + "CustomTile",
  nestingLevel: "bigBoxCollection",

};

export const CustomTile = createVisualComponent({
  ...STATICS,

  propTypes: {
    data: UU5.PropTypes.object,
  },

  render(props) {
    const { data:item, handleUpdateModal} = props;

    const confirm = props.getConfirmRef();

    async function handleCompleted(){
      const value = {"state": "completed"}
      await item.handlerMap.setFinalState(value)
    }

    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );
    return currentNestingLevel ? (
      <div {...attrs}>
            {item.data.state !== "completed" ?
            <UU5.Bricks.Div style={{ backgroundColor: UU5.Environment.colors.grey.c100, display: "flex", alignItems: "baseline", justifyContent:"space-between"}} > 
                 <div style={{ display: "flex", alignItems: "baseline"}}>
                  <UU5.Forms.Checkbox 
                  size="m"
                  value={item.data.state === "completed"? true : false}
                  onChange={()=> handleCompleted()}
                  /> 
                  <UU5.Bricks.Text content={item?.data?.text}/>
                </div>
              <div style={{ display: "flex", alignItems: "baseline"}}>
                <UU5.Bricks.Button bgStyle="transparent"
                      onClick={()=> handleUpdateModal(item)} >
                <UU5.Bricks.Icon icon="plus4u5-pencil" /></UU5.Bricks.Button> 
                <UU5.Bricks.Button bgStyle="transparent"
                    onClick={() => {
                      return confirm.open({
                        header: <UU5.Bricks.Header level={4} content="Delete item" />,
                        content: <UU5.Bricks.Div>Are you sure you want to delete this item?</UU5.Bricks.Div>,
                        on: () => confirm.close(),
                        onConfirm: item?.handlerMap?.delete
                      })
                    }} ><UU5.Bricks.Icon icon="plus4u-bin"/>
                </UU5.Bricks.Button> 
                </div>
              </UU5.Bricks.Div>
              : 
              <UU5.Bricks.Div style={{ backgroundColor: UU5.Environment.colors.grey.c100, display: "flex", alignItems: "baseline"}} > 
                <UU5.Forms.Checkbox disabled
                size="m"
                value={item.data.state === "completed"? true : false}
                onChange={()=> handleCompleted()}
                /> 
                <UU5.Bricks.Text disabled content={item?.data?.text}/>
            </UU5.Bricks.Div>}
      </div>
    ) : null;
  },
});

export default CustomTile;