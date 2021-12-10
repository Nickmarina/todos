//@@viewOn:imports
import { useContext } from "uu5g04-hooks";
import Context from "./item-context";
//@@viewOff:imports

export function useItem() {
  return useContext(Context);
}

export default useItem;