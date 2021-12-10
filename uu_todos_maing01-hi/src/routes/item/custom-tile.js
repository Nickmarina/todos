//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "CustomTile",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const CustomTile = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object,
    // handleOpenDetailsModal: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data:item, handleUpdateModal} = props;
    const confirm = props.getConfirmRef();
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );

    return currentNestingLevel ? (
      <div {...attrs}>

        <UU5.Bricks.Card width={800} className="uu5-common-padding-s"> 
        <UU5.Bricks.Header content={item?.data?.text} colorSchema="cyan" level="5"/>
        <UU5.Bricks.Button colorSchema="cyan"  bgStyle="outline" 
              onClick={()=> handleUpdateModal(item)} >
        <UU5.Bricks.Icon icon="plus4u5-pencil" /></UU5.Bricks.Button> 
        <UU5.Bricks.Button colorSchema="red" bgStyle="outline"
             onClick={() => {
              return confirm.open({
                header: <UU5.Bricks.Header level={4} content="Delete item" />,
                content: <UU5.Bricks.Div>Are you sure you want to delete this item?</UU5.Bricks.Div>,
                on: () => confirm.close(),
                onConfirm: item?.handlerMap?.delete
              })
            }} ><UU5.Bricks.Icon icon="plus4u-bin"/>
        </UU5.Bricks.Button> 
        </UU5.Bricks.Card> 
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default CustomTile;