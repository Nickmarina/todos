import { useContext } from "uu5g04-hooks";
import Context from "./item-context";

export function useItem() {
  return useContext(Context);
}

export default useItem;