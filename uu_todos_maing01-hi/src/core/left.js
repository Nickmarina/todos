//@@viewOn:imports
import Plus4U5 from "uu_plus4u5g01";
import "uu5g04-bricks";
import { createVisualComponent } from "uu5g04-hooks";
import "uu_plus4u5g01-app";
import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import List from "../routes/list/list";
import ListLoader from '../routes/list/list-loader';
import ListContext from "../routes/list/context/list-context";
import { ModalManager } from "../routes/list/common/modal-manager.js";
import DataListStateResolver from "../routes/list/common/data-list-state-resolver.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:static
  displayName: Config.TAG + "Left",
  //@@viewOff:static
};

export const Left = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {

    // {data.map(item => list = item )}
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <ModalManager>
      <Plus4U5.App.Left
              {...props}
              logoProps={{
                backgroundColor: UU5.Environment.colors.blue.c700,
                backgroundColorTo: UU5.Environment.colors.blue.c500,
                title: "uuTodos",
                companyLogo: Plus4U5.Environment.basePath + "assets/img/unicorn-logo.svg",
                generation: "1",
              }}
              // aboutItems={[{ content: <UU5.Bricks.Lsi lsi={Lsi.left.about} />, href: "about" }]}
              helpHref={null}
            >  
        <ListLoader>
         <ListContext.Consumer>
          {
          (dataListResult)=>{
            return(
              <DataListStateResolver dataList={dataListResult}>
                 <List/>
              </DataListStateResolver>
            )
          }
        }
       </ListContext.Consumer>
      </ListLoader>
    );
    </Plus4U5.App.Left>
    </ModalManager>
    );
    //@@viewOff:render
  },
});

export default Left;
