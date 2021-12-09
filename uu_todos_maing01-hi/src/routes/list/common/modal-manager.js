//@@viewOn:revision
// coded: Sofiia Franchuk (2734-2114-1), 11.08.2021
// reviewed:
//@@viewOff:revision

//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent, useRef, useContext } from "uu5g04-hooks";

import Config from "../config/config";
//@@viewOff:imports

const ContextModalStore = UU5.Common.Context.create();

export function useContextModal() {
  return useContext(ContextModalStore);
}

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ModalManager",
  //@@viewOff:statics
};

export const ModalManager = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const modalRef = useRef();
    const confirmRef = useRef();
    const alertBusRef = useRef();
    //@@viewOff:private

    //@@viewOn:interface
    function open(openProps) {
      modalRef.current.open(openProps);
    }

    function close(shouldOnClose = true, callback) {
      modalRef.current.close(shouldOnClose, () => {
        if (typeof callback === "function") {
          callback();
        }
      });
    }

    function showAlert(showProps) {
      return alertBusRef.current.setAlert(showProps);
    }

    function getConfirmRef() {
      return confirmRef.current;
    }

    //@@viewOff:interface

    //@@viewOn:render
    return (
      <ContextModalStore.Provider value={[open, close, showAlert, getConfirmRef]}>
        <UU5.Forms.ContextModal size="l" ref={modalRef} />
        <UU5.Bricks.AlertBus colorSchema={UU5.Environment.colorSchemaMap.green.color} ref={alertBusRef} />
        <UU5.Bricks.ConfirmModal ref={confirmRef} />
        {props.children}
      </ContextModalStore.Provider>
    );
    //@@viewOff:render
  },
});

export default { ModalManager, useContextModal };
