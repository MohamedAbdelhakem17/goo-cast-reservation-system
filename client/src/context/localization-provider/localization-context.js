import { createContext, useContext } from "react";
export const LocalesContext = createContext();
const useLocalization = () => useContext(LocalesContext);
export default useLocalization;
