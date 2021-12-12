import { useContext } from "uu5g04-hooks";
import Context from "./list-context";

export function useList() {
  return useContext(Context);
}

export default useList;